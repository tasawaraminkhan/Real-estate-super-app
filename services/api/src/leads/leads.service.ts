import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    propertyId: string;
    buyerId?: string;
    agentId?: string;
    buyerPhone?: string;
    buyerName?: string;
    source?: string;
    notes?: string;
  }) {
    return this.prisma.lead.create({ data: { ...data, stage: "NEW" } });
  }

  async updateStage(id: string, stage: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException({ error: { code: "NOT_FOUND", message: "Lead not found" } });
    return this.prisma.lead.update({ where: { id }, data: { stage: stage as never } });
  }

  list(agentId?: string) {
    return this.prisma.lead.findMany({
      where: agentId ? { agentId } : undefined,
      orderBy: { createdAt: "desc" },
      include: { property: { select: { id: true, title: true, priceAmount: true } } },
      take: 100,
    });
  }
}
