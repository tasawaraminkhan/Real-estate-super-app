import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  moderationQueue() {
    return this.prisma.property.findMany({
      where: { status: "PENDING_REVIEW", deletedAt: null },
      orderBy: { updatedAt: "asc" },
      take: 50,
      include: { media: { take: 5 }, owner: { select: { id: true, phone: true, verificationStatus: true } } },
    });
  }

  async moderate(id: string, action: "approve" | "reject", reason?: string) {
    const p = await this.prisma.property.findUnique({ where: { id } });
    if (!p) throw new NotFoundException({ error: { code: "NOT_FOUND", message: "Not found" } });
    return this.prisma.property.update({
      where: { id },
      data: {
        status: action === "approve" ? "ACTIVE" : "REJECTED",
        publishedAt: action === "approve" ? new Date() : p.publishedAt,
        isVerified: action === "approve",
      },
    });
  }

  dashboard() {
    return Promise.all([
      this.prisma.property.count({ where: { status: "ACTIVE" } }),
      this.prisma.property.count({ where: { status: "PENDING_REVIEW" } }),
      this.prisma.user.count(),
      this.prisma.lead.count({ where: { stage: "NEW" } }),
      this.prisma.transaction.count({ where: { status: "PAID" } }),
    ]).then(([activeListings, pendingReview, users, newLeads, paidTx]) => ({
      activeListings,
      pendingReview,
      users,
      newLeads,
      paidTx,
    }));
  }
}
