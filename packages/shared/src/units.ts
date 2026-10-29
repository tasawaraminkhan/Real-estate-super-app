/**
 * Single source of truth for area conversion.
 * Pakistan: Marla varies by city — Punjab standard 225 sqft is default.
 * City overrides can be applied later via config.
 */

export type AreaUnit = "MARLA" | "KANAL" | "SQFT" | "SQM" | "SQYD" | "ACRE";

export const AREA_TO_SQFT: Record<AreaUnit, number> = {
  MARLA: 225,
  KANAL: 4500, // 20 Marla
  SQFT: 1,
  SQYD: 9,
  SQM: 10.7639,
  ACRE: 43560,
};

export function toSqft(value: number, unit: AreaUnit): number {
  if (value <= 0) throw new Error("Area must be positive");
  return value * AREA_TO_SQFT[unit];
}

export function fromSqft(sqft: number, unit: AreaUnit): number {
  if (sqft <= 0) throw new Error("Area must be positive");
  return sqft / AREA_TO_SQFT[unit];
}

export function formatArea(value: number, unit: AreaUnit): string {
  const rounded = Math.round(value * 100) / 100;
  const labels: Record<AreaUnit, string> = {
    MARLA: "Marla",
    KANAL: "Kanal",
    SQFT: "sqft",
    SQM: "m²",
    SQYD: "sqyd",
    ACRE: "Acre",
  };
  return `${rounded} ${labels[unit]}`;
}

/** Approximate display for Pakistani market */
export function formatPricePkr(amountMinor: number): string {
  // amountMinor is paisa (1 PKR = 100)
  const pkr = amountMinor / 100;
  if (pkr >= 10_000_000) {
    return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  }
  if (pkr >= 100_000) {
    return `PKR ${(pkr / 100_000).toFixed(2)} Lac`;
  }
  return `PKR ${Math.round(pkr).toLocaleString("en-PK")}`;
}
