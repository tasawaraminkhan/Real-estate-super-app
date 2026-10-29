import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FraudService } from "../fraud/fraud.service";

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fraud: FraudService,
  ) {}

  async findAll(page = 1, limit = 20) {
    const take = Math.min(50, limit);
    const skip = (page - 1) * take;
    const where = { status: "ACTIVE" as const, deletedAt: null };
    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
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
        owner: { select: { id: true, fullName: true, phone: true, verificationStatus: true } },
      },
    });
    if (!p) throw new NotFoundException({ error: { code: "NOT_FOUND", message: "Property not found" } });
    void this.prisma.property.update({ where: { id }, data: { viewsCount: { increment: 1 } } }).catch(() => undefined);
    return this.serialize(p);
  }

  async createDraft(ownerId: string, data: Record<string, unknown>) {
    const title = (data.title as string) || "Untitled draft";
    return this.prisma.property.create({
      data: {
        ownerId,
        purpose: (data.purpose as never) || "SALE",
        category: (data.category as never) || "RESIDENTIAL",
        type: (data.type as never) || "PLOT",
        title,
        description: data.description as string | undefined,
        areaValue: Number(data.areaValue ?? 1),
        areaUnit: (data.areaUnit as never) || "MARLA",
        priceAmount: BigInt(String(data.priceAmount ?? 0)),
        currency: (data.currency as string) || "PKR",
        priceType: (data.priceType as never) || "NEGOTIABLE",
        latitude: data.latitude != null ? Number(data.latitude) : undefined,
        longitude: data.longitude != null ? Number(data.longitude) : undefined,
        addressText: data.addressText as string | undefined,
        societyId: data.societyId as string | undefined,
        cityId: data.cityId as string | undefined,
        bedrooms: data.bedrooms != null ? Number(data.bedrooms) : undefined,
        bathrooms: data.bathrooms != null ? Number(data.bathrooms) : undefined,
        constructionState: data.constructionState as never,
        possession: data.possession as never,
        corner: Boolean(data.corner),
        parkFacing: Boolean(data.parkFacing),
        installmentAvailable: Boolean(data.installmentAvailable),
        status: "DRAFT",
      },
    }).then((p) => this.serialize(p));
  }

  async update(ownerId: string, id: string, data: Record<string, unknown>) {
    const existing = await this.prisma.property.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException({ error: { code: "NOT_FOUND", message: "Not found" } });
    if (existing.ownerId !== ownerId) throw new ForbiddenException({ error: { code: "FORBIDDEN", message: "Not owner" } });

    const patch: Record<string, unknown> = {};
    for (const key of [
      "title", "description", "purpose", "category", "type", "areaUnit", "priceType",
      "addressText", "societyId", "cityId", "constructionState", "possession", "currency",
    ]) {
      if (data[key] !== undefined) patch[key] = data[key];
    }
    if (data.areaValue != null) patch.areaValue = Number(data.areaValue);
    if (data.priceAmount != null) patch.priceAmount = BigInt(String(data.priceAmount));
    if (data.latitude != null) patch.latitude = Number(data.latitude);
    if (data.longitude != null) patch.longitude = Number(data.longitude);
    if (data.bedrooms != null) patch.bedrooms = Number(data.bedrooms);
    if (data.bathrooms != null) patch.bathrooms = Number(data.bathrooms);
    if (data.corner != null) patch.corner = Boolean(data.corner);
    if (data.parkFacing != null) patch.parkFacing = Boolean(data.parkFacing);

    const updated = await this.prisma.property.update({ where: { id }, data: patch as never });
    return this.serialize(updated);
  }

  async submit(ownerId: string, id: string) {
    const p = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: { media: true, owner: true },
    });
    if (!p) throw new NotFoundException({ error: { code: "NOT_FOUND", message: "Not found" } });
    if (p.ownerId !== ownerId) throw new ForbiddenException({ error: { code: "FORBIDDEN", message: "Not owner" } });
    if (p.media.length < 3 && process.env.NODE_ENV === "production") {
      throw new BadRequestException({ error: { code: "MIN_PHOTOS", message: "At least 3 photos required" } });
    }
    if (p.priceAmount <= 0n) {
      throw new BadRequestException({ error: { code: "INVALID_PRICE", message: "Price must be > 0" } });
    }

    const fraud = this.fraud.score({
      priceAmount: Number(p.priceAmount),
      description: p.description ?? undefined,
      photoCount: p.media.length,
      userListingCount24h: 1,
      accountAgeDays: 30,
      verified: p.owner.verificationStatus === "VERIFIED",
      latitude: p.latitude ?? undefined,
      longitude: p.longitude ?? undefined,
    });

    await this.prisma.fraudSignal.create({
      data: { propertyId: id, score: fraud.score, signals: fraud.signals, action: fraud.action },
    });

    const status =
      fraud.action === "auto_hold" ? "PENDING_REVIEW" : fraud.action === "hold" ? "PENDING_REVIEW" : "ACTIVE";

    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        status: status as never,
        publishedAt: status === "ACTIVE" ? new Date() : p.publishedAt,
      },
    });

    return { property: this.serialize(updated), fraud };
  }

  async myListings(ownerId: string) {
    const items = await this.prisma.property.findMany({
      where: { ownerId, deletedAt: null },
      orderBy: { updatedAt: "desc" },
      include: { media: { take: 1 } },
    });
    return items.map((p) => this.serialize(p));
  }

  async toggleFavourite(userId: string, propertyId: string) {
    const existing = await this.prisma.favourite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (existing) {
      await this.prisma.favourite.delete({ where: { id: existing.id } });
      return { favourited: false };
    }
    await this.prisma.favourite.create({ data: { userId, propertyId } });
    return { favourited: true };
  }

  async listFavourites(userId: string) {
    const rows = await this.prisma.favourite.findMany({
      where: { userId },
      include: { property: { include: { media: { take: 1 }, society: true, city: true } } },
    });
    return rows.map((r) => this.serialize(r.property));
  }

  private serialize(p: Record<string, unknown>) {
    const out = { ...p } as Record<string, unknown>;
    for (const key of ["priceAmount", "downPayment", "monthlyInstallment"]) {
      if (typeof out[key] === "bigint") out[key] = (out[key] as bigint).toString();
    }
    return out;
  }
}
