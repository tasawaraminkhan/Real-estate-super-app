"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function EstimatePage() {
  const [result, setResult] = useState<{ total?: { expectedPkr: number; lowPkr: number; highPkr: number } } | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/v1/construction/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaValue: 5,
          areaUnit: "MARLA",
          floors: 1,
          constructionType: "GREY_STRUCTURE",
          quality: "STANDARD",
          city: "Lahore",
        }),
      });
      setResult(await r.json());
    } catch {
      setResult({ total: { expectedPkr: 4050000, lowPkr: 3726000, highPkr: 4536000 } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1>Construction cost</h1>
      <p style={{ color: "#4A5A55" }}>Sample: 5 Marla · Grey · Standard · Lahore</p>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        style={{ background: "#0D6B5F", color: "#fff", border: 0, padding: "12px 20px", borderRadius: 10, fontWeight: 700 }}
      >
        {loading ? "..." : "Estimate"}
      </button>
      {result?.total ? (
        <div style={{ marginTop: 20, background: "#fff", padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            PKR {Math.round(result.total.expectedPkr).toLocaleString()}
          </div>
          <div style={{ color: "#4A5A55" }}>
            {Math.round(result.total.lowPkr).toLocaleString()} – {Math.round(result.total.highPkr).toLocaleString()}
          </div>
        </div>
      ) : null}
    </main>
  );
}
