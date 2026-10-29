import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SocietiesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.society.findMany({
      where: { deletedAt: null },
      include: { city: { select: { id: true, name: true } }, _count: { select: { plots: true, properties: true } } },
    });
  }

  async getMap(id: string) {
    const society = await this.prisma.society.findFirst({
      where: { id, deletedAt: null },
      include: { city: true },
    });
    if (!society) throw new NotFoundException({ error: { code: "NOT_FOUND", message: "Society not found" } });

    const plots = await this.prisma.plot.findMany({
      where: { societyId: id, deletedAt: null },
    });

    const statusColours: Record<string, string> = {
      AVAILABLE: "#1F7A4C",
      SOLD: "#8A8F8C",
      ON_HOLD: "#C6890B",
      FILE_ONLY: "#0D6B5F",
      POSSESSION: "#0A5148",
    };

    return {
      type: "FeatureCollection",
      features: plots.map((plot) => ({
        type: "Feature",
        properties: {
          plotId: plot.id,
          plotNo: plot.plotNo,
          block: plot.block,
          phase: plot.phase,
          status: plot.status,
          areaValue: plot.areaValue,
          areaUnit: plot.areaUnit,
          colour: statusColours[plot.status] ?? "#C9CFCB",
          listingId: plot.listingId,
        },
        geometry: null, // polygons via PostGIS migration later
      })),
      society: {
        id: society.id,
        name: society.name,
        city: society.city?.name,
        totalPlots: society.totalPlots,
      },
    };
  }
}
