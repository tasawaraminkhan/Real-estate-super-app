import { z } from "zod";
import {
  PropertyPurpose,
  PropertyCategory,
  PropertyType,
  ConstructionState,
  Possession,
  PriceType,
} from "./enums";
import type { AreaUnit } from "./units";

const areaUnitSchema = z.enum(["MARLA", "KANAL", "SQFT", "SQM", "SQYD", "ACRE"]);

export const searchFiltersSchema = z.object({
  q: z.string().min(2).optional(),
  purpose: z.enum(["SALE", "RENT", "SHORT_STAY"]).optional(),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "AGRICULTURAL", "INDUSTRIAL"]).optional(),
  types: z.array(z.string()).optional(),
  cityId: z.string().uuid().optional(),
  societyIds: z.array(z.string().uuid()).optional(),
  priceMin: z.number().int().nonnegative().optional(),
  priceMax: z.number().int().positive().optional(),
  currency: z.string().length(3).optional(),
  areaMin: z.number().positive().optional(),
  areaMax: z.number().positive().optional(),
  areaUnit: areaUnitSchema.optional(),
  bedroomsMin: z.number().int().min(0).optional(),
  bathroomsMin: z.number().int().min(0).optional(),
  constructionStates: z.array(z.string()).optional(),
  possession: z.array(z.string()).optional(),
  corner: z.boolean().optional(),
  parkFacing: z.boolean().optional(),
  installmentAvailable: z.boolean().optional(),
  maxDownPayment: z.number().int().optional(),
  verifiedOnly: z.boolean().optional(),
  featuredFirst: z.boolean().optional(),
  center: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      radiusKm: z.number().positive().max(100),
    })
    .optional(),
  bbox: z
    .object({
      ne: z.object({ lat: z.number(), lng: z.number() }),
      sw: z.object({ lat: z.number(), lng: z.number() }),
    })
    .optional(),
  polygon: z
    .array(z.object({ lat: z.number(), lng: z.number() }))
    .max(50)
    .optional(),
  sort: z
    .enum([
      "RELEVANCE",
      "NEWEST",
      "PRICE_ASC",
      "PRICE_DESC",
      "AREA_DESC",
      "PRICE_PER_SQFT_ASC",
      "DISTANCE",
    ])
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

export const createPropertyDraftSchema = z.object({
  purpose: z.nativeEnum(PropertyPurpose),
  category: z.nativeEnum(PropertyCategory),
  type: z.nativeEnum(PropertyType),
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(30).max(4000).optional(),
  areaValue: z.number().positive().optional(),
  areaUnit: areaUnitSchema.optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floors: z.number().int().min(0).optional(),
  constructionState: z.nativeEnum(ConstructionState).optional(),
  possession: z.nativeEnum(Possession).optional(),
  corner: z.boolean().optional(),
  parkFacing: z.boolean().optional(),
  priceAmount: z.number().int().positive().optional(), // minor units
  currency: z.string().length(3).default("PKR"),
  priceType: z.nativeEnum(PriceType).optional(),
  installmentAvailable: z.boolean().optional(),
  downPayment: z.number().int().optional(),
  monthlyInstallment: z.number().int().optional(),
  installmentMonths: z.number().int().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  addressText: z.string().max(500).optional(),
  societyId: z.string().uuid().optional(),
  cityId: z.string().uuid().optional(),
});

export type CreatePropertyDraft = z.infer<typeof createPropertyDraftSchema>;
