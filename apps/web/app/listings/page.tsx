const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEMO = [
  { id: "1", title: "10 Marla Plot — DHA Phase 5", priceAmount: "24500000000", areaValue: 10, areaUnit: "MARLA" },
  { id: "2", title: "5 Marla House — Bahria Karachi", priceAmount: "18500000000", areaValue: 5, areaUnit: "MARLA" },
];

function formatPrice(paisa: string) {
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  if (pkr >= 100_000) return `PKR ${(pkr / 100_000).toFixed(1)} Lac`;
  return `PKR ${Math.round(pkr).toLocaleString()}`;
}

async function load() {
  try {
    const r = await fetch(`${API}/api/v1/properties?limit=20`, { cache: "no-store" });
    if (!r.ok) throw new Error("x");
    const d = await r.json();
    return d.items || DEMO;
  } catch {
    return DEMO;
  }
}

export default async function ListingsPage() {
  const items = await load();
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Listings</h1>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((i: { id: string; title: string; priceAmount: string; areaValue: number; areaUnit: string }) => (
          <article key={i.id} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #ddd" }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{formatPrice(i.priceAmount)}</div>
            <div>{i.title}</div>
            <div style={{ color: "#4A5A55", fontSize: 14, marginTop: 4 }}>
              {i.areaValue} {i.areaUnit}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
