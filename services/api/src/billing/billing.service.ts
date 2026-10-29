import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { randomUUID } from "crypto";

const PLANS = [
  { code: "FREE" as const, name: "Free", priceMonthly: 0n, maxListings: 3, maxPhotos: 5, maxSeats: 1, featuredCredits: 0 },
  { code: "STARTER" as const, name: "Starter", priceMonthly: 30000000n, maxListings: 15, maxPhotos: 25, maxSeats: 1, featuredCredits: 0 },
  { code: "PROFESSIONAL" as const, name: "Professional", priceMonthly: 80000000n, maxListings: 50, maxPhotos: 25, maxSeats: 3, featuredCredits: 5 },
  { code: "AGENCY" as const, name: "Agency", priceMonthly: 200000000n, maxListings: 200, maxPhotos: 25, maxSeats: 10, featuredCredits: 20 },
];

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async ensurePlans() {
    for (const p of PLANS) {
      await this.prisma.plan.upsert({
        where: { code: p.code },
        update: { name: p.name, priceMonthly: p.priceMonthly, maxListings: p.maxListings, maxPhotos: p.maxPhotos, maxSeats: p.maxSeats, featuredCredits: p.featuredCredits },
        create: p,
      });
    }
    return this.prisma.plan.findMany({ where: { isActive: true } });
  }

  listPlans() {
    return this.prisma.plan.findMany({ where: { isActive: true } }).then((rows) =>
      rows.map((r) => ({
        ...r,
        priceMonthly: r.priceMonthly.toString(),
        pricePkr: Number(r.priceMonthly) / 100,
      })),
    );
  }

  async createPaymentIntent(userId: string, planCode: string, provider = "mock") {
    const plan = await this.prisma.plan.findUnique({ where: { code: planCode as never } });
    if (!plan) throw new NotFoundException({ error: { code: "PLAN_NOT_FOUND", message: "Plan not found" } });
    if (plan.priceMonthly === 0n) throw new BadRequestException({ error: { code: "FREE_PLAN", message: "Free plan needs no payment" } });

    const tx = await this.prisma.transaction.create({
      data: {
        userId,
        amount: plan.priceMonthly,
        currency: "PKR",
        status: "PENDING",
        provider,
        purpose: "subscription",
        providerRef: `mock_${randomUUID().slice(0, 8)}`,
        meta: { planCode },
      },
    });

    return {
      transactionId: tx.id,
      amount: tx.amount.toString(),
      amountPkr: Number(tx.amount) / 100,
      currency: "PKR",
      provider,
      status: tx.status,
      // Mock: client calls /billing/confirm with this id
      payUrl: provider === "mock" ? null : `https://pay.example/${tx.id}`,
      message: provider === "mock" ? "Dev mode: POST /billing/confirm with transactionId" : "Redirect user to payUrl",
    };
  }

  async confirmPayment(transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) throw new NotFoundException({ error: { code: "TX_NOT_FOUND", message: "Transaction not found" } });
    if (tx.status === "PAID") return { alreadyPaid: true, transactionId };

    const meta = tx.meta as { planCode?: string } | null;
    const planCode = meta?.planCode ?? "STARTER";
    const plan = await this.prisma.plan.findUnique({ where: { code: planCode as never } });
    if (!plan) throw new NotFoundException({ error: { code: "PLAN_NOT_FOUND", message: "Plan missing" } });

    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);

    await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: "PAID" },
      }),
      this.prisma.subscription.create({
        data: {
          userId: tx.userId,
          planId: plan.id,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: end,
          featuredCredits: plan.featuredCredits,
        },
      }),
    ]);

    return { paid: true, transactionId, plan: plan.code, periodEnd: end.toISOString() };
  }

  async featureListing(userId: string, propertyId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE", featuredCredits: { gt: 0 } },
      orderBy: { createdAt: "desc" },
    });
    if (!sub) {
      throw new BadRequestException({
        error: { code: "NO_CREDITS", message: "No featured credits — upgrade plan or buy add-on" },
      });
    }
    const boostUntil = new Date();
    boostUntil.setDate(boostUntil.getDate() + 7);

    await this.prisma.$transaction([
      this.prisma.subscription.update({
        where: { id: sub.id },
        data: { featuredCredits: { decrement: 1 } },
      }),
      this.prisma.property.update({
        where: { id: propertyId },
        data: { isFeatured: true, boostUntil },
      }),
    ]);

    return { featured: true, boostUntil: boostUntil.toISOString(), creditsLeft: sub.featuredCredits - 1 };
  }
}
