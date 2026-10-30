/** Money stored as paisa (1 PKR = 100 paisa) */
export function formatPriceFromPaisa(paisa: string | number): string {
  const n = typeof paisa === "string" ? Number(paisa) : paisa;
  if (!Number.isFinite(n) || n < 0) return "—";
  const pkr = n / 100;
  if (pkr >= 10_000_000) return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  if (pkr >= 100_000) return `PKR ${(pkr / 100_000).toFixed(1)} Lac`;
  if (pkr >= 1_000) return `PKR ${Math.round(pkr).toLocaleString("en-PK")}`;
  return `PKR ${Math.round(pkr)}`;
}

/** Pakistan mobile: 03XXXXXXXXX or +923XXXXXXXXX */
export function normalizePkPhone(raw: string): string | null {
  const d = raw.replace(/[\s\-()]/g, "");
  if (/^\+923\d{9}$/.test(d)) return d;
  if (/^923\d{9}$/.test(d)) return `+${d}`;
  if (/^03\d{9}$/.test(d)) return `+92${d.slice(1)}`;
  if (/^3\d{9}$/.test(d)) return `+92${d}`;
  return null;
}

export function displayPkPhone(e164: string): string {
  if (e164.startsWith("+92")) return `0${e164.slice(3)}`;
  return e164;
}

/** Common Pakistan area conversions (standard municipal Marla ≈ 225 sqft) */
export function toSqft(value: number, unit: string): number {
  const u = unit.toUpperCase();
  if (u === "SQFT") return value;
  if (u === "MARLA") return value * 225;
  if (u === "KANAL") return value * 20 * 225; // 20 Marla
  if (u === "SQYD") return value * 9;
  if (u === "SQM") return value * 10.7639;
  if (u === "ACRE") return value * 43560;
  return value * 225;
}
