import { Injectable } from "@nestjs/common";

/**
 * Placeholder service — real Prisma queries come in P04/P06.
 * For now returns static seed-style data so the vertical slice is runnable.
 */
@Injectable()
export class PropertiesService {
  private readonly sample = [
    {
      id: "00000000-0000-4000-8000-000000000001",
      title: "10 Marla Plot — DHA Phase 5, Lahore",
      purpose: "SALE",
      type: "PLOT",
      areaValue: 10,
      areaUnit: "MARLA",
      priceAmount: 2450000000, // 2.45 Cr in paisa
      currency: "PKR",
      city: "Lahore",
      society: "DHA Phase 5",
      status: "ACTIVE",
      latitude: 31.4697,
      longitude: 74.4081,
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      title: "5 Marla House — Bahria Town Karachi",
      purpose: "SALE",
      type: "HOUSE",
      areaValue: 5,
      areaUnit: "MARLA",
      priceAmount: 1850000000,
      currency: "PKR",
      city: "Karachi",
      society: "Bahria Town",
      status: "ACTIVE",
      latitude: 25.0124,
      longitude: 67.3121,
    },
  ];

  findAll(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const items = this.sample.slice(start, start + limit);
    return {
      items,
      pageInfo: {
        page,
        limit,
        total: this.sample.length,
        hasMore: start + limit < this.sample.length,
      },
    };
  }

  findOne(id: string) {
    return this.sample.find((p) => p.id === id) ?? null;
  }
}
