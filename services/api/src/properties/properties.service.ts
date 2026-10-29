import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const take = Math.min(50, limit);
    const skip = (page - 1) * take;
    const where = { status: "ACTIVE" as const, deletedAt: null };

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: "desc" },
        include: {
          society: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          media: { take: 3, orderBy: { sortOrder: "asc" } },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      items: items.map((p) => this.serialize(p)),
      pageInfo: { page, limit: take, total, hasMore: skip + take < total },
    };
  }

  async findOne(id: string) {
    const p = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: {
        society: true,
        city: true,
        media: { orderBy: { sortOrder: "asc" } },
        owner: {
          select: { id: true, fullName: true, phone: true, verificationStatus: true },
        },
      },
    });
    if (!p) {
      throw new NotFoundException({
        error: { code: "NOT_FOUND", message: "Property not found" },
      });
    }
    void this.prisma.property
      .update({ where: { id }, data: { viewsCount: { increment: 1 } } })
      .catch(() => undefined);
    return this.serialize(p);
  }

  private serialize(p: Record<string, unknown>) {
    const out = { ...p } as Record<string, unknown>;
    for (const key of ["priceAmount", "downPayment", "monthlyInstallment"]) {
      if (typeof out[key] === "bigint") out[key] = (out[key] as bigint).toString();
    }
    return out;
  }
}
