import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

export interface SearchQuery {
  purpose?: string;
  category?: string;
  cityId?: string;
  societyId?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  areaUnit?: string;
  bedroomsMin?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q: SearchQuery) {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(50, Math.max(1, q.limit ?? 20));
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      status: "ACTIVE",
      deletedAt: null,
    };

    if (q.purpose) where.purpose = q.purpose as Prisma.EnumPropertyPurposeFilter;
    if (q.category) where.category = q.category as Prisma.EnumPropertyCategoryFilter;
    if (q.cityId) where.cityId = q.cityId;
    if (q.societyId) where.societyId = q.societyId;
    if (q.priceMin != null || q.priceMax != null) {
      where.priceAmount = {};
      if (q.priceMin != null) where.priceAmount.gte = BigInt(q.priceMin);
      if (q.priceMax != null) where.priceAmount.lte = BigInt(q.priceMax);
    }
    if (q.bedroomsMin != null) {
      where.bedrooms = { gte: q.bedroomsMin };
    }
    if (q.areaMin != null || q.areaMax != null) {
      where.areaValue = {};
      if (q.areaMin != null) where.areaValue.gte = q.areaMin;
      if (q.areaMax != null) where.areaValue.lte = q.areaMax;
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = { publishedAt: "desc" };
    if (q.sort === "PRICE_ASC") orderBy = { priceAmount: "asc" };
    if (q.sort === "PRICE_DESC") orderBy = { priceAmount: "desc" };
    if (q.sort === "NEWEST") orderBy = { publishedAt: "desc" };

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          society: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          media: { take: 1, orderBy: { sortOrder: "asc" } },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        ...p,
        priceAmount: p.priceAmount.toString(),
        downPayment: p.downPayment?.toString() ?? null,
        monthlyInstallment: p.monthlyInstallment?.toString() ?? null,
      })),
      pageInfo: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
      appliedFilters: q,
    };
  }
}
