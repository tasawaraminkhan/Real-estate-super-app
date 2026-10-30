import { Injectable, BadRequestException } from "@nestjs/common";

/** Deterministic cost engine — rates versioned; no float money */
const FACTORS = {
  GREY_STRUCTURE: { cement: 0.42, steel: 4.2, bricks: 8.5, sand: 1.8, crush: 1.2, labour_grey: 1 },
  TURNKEY: { cement: 0.5, steel: 5.0, bricks: 9.5, sand: 2.2, crush: 1.5, labour_grey: 1.35 },
  SEMI_FINISHED: { cement: 0.46, steel: 4.6, bricks: 9.0, sand: 2.0, crush: 1.35, labour_grey: 1.15 },
};

const QUALITY_MULT = { ECONOMY: 1.0, STANDARD: 1.18, PREMIUM: 1.42, LUXURY: 1.75 };
const CITY_MULT: Record<string, number> = {
  Karachi: 1.12, Lahore: 1.08, Islamabad: 1.15, Rawalpindi: 1.1,
  Multan: 1.0, Faisalabad: 1.03, Peshawar: 1.02, Quetta: 1.05,
  Sialkot: 1.04, Gujranwala: 1.03, Hyderabad: 1.06, Bahawalpur: 1.0,
  DEFAULT: 1.0,
};

/** Sample 2025 rates (paisa per unit) — seed/verify before production */
const RATES: Record<string, number> = {
  cement: 135000, // PKR 1350/bag
  steel: 26500, // PKR 265/kg
  bricks: 2200,
  sand: 6000,
  crush: 6500,
  labour_grey: 45000, // per sqft
};

const MARLA_SQFT = 225;

@Injectable()
export class ConstructionService {
  estimate(input: {
    areaValue: number;
    areaUnit: string;
    floors?: number;
    constructionType: "GREY_STRUCTURE" | "TURNKEY" | "SEMI_FINISHED";
    quality: "ECONOMY" | "STANDARD" | "PREMIUM" | "LUXURY";
    city?: string;
  }) {
    if (input.areaValue <= 0) {
      throw new BadRequestException({ error: { code: "INVALID_AREA", message: "Area must be positive" } });
    }
    const sqft =
      input.areaUnit === "MARLA"
        ? input.areaValue * MARLA_SQFT
        : input.areaUnit === "KANAL"
          ? input.areaValue * 20 * MARLA_SQFT
          : input.areaUnit === "SQFT"
            ? input.areaValue
            : input.areaUnit === "SQYD"
              ? input.areaValue * 9
              : input.areaValue * MARLA_SQFT;

    const floors = input.floors ?? 1;
    const factors = FACTORS[input.constructionType];
    const qMult = QUALITY_MULT[input.quality];
    const cMult = CITY_MULT[input.city ?? "DEFAULT"] ?? CITY_MULT.DEFAULT ?? 1.0;

    const lines: { item: string; qty: number; unit: string; rate: number; total: number }[] = [];
    let expected = 0;

    for (const [mat, factor] of Object.entries(factors)) {
      const rate = RATES[mat] ?? 0;
      const qty = factor * sqft * floors;
      const total = Math.round(qty * rate * qMult * cMult);
      expected += total;
      lines.push({
        item: mat,
        qty: Math.round(qty * 100) / 100,
        unit: mat === "labour_grey" ? "sqft" : mat === "cement" ? "bag" : mat === "steel" ? "kg" : mat === "bricks" ? "no" : "cft",
        rate,
        total,
      });
    }

    const low = Math.round(expected * 0.92);
    const high = Math.round(expected * 1.12);

    return {
      areaSqft: sqft,
      floors,
      constructionType: input.constructionType,
      quality: input.quality,
      city: input.city ?? "DEFAULT",
      lineItems: lines.map((l) => ({
        ...l,
        ratePkr: l.rate / 100,
        totalPkr: l.total / 100,
      })),
      total: {
        lowPaisa: low,
        expectedPaisa: expected,
        highPaisa: high,
        lowPkr: low / 100,
        expectedPkr: expected / 100,
        highPkr: high / 100,
        perSqftPkr: Math.round(expected / 100 / sqft),
      },
      confidence: "medium",
      disclaimer:
        "Ye estimate sample rates (2025) par based hai. Actual rates city/contractor se verify karein. Range low -8% / high +12%.",
      modelVersion: "cost-engine-v1",
    };
  }
}
