const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getDash() {
  try {
    const r = await fetch(`${API}/api/v1/admin/dashboard`, { cache: "no-store" });
    if (!r.ok) throw new Error("fail");
    return r.json();
  } catch {
    return { activeListings: "—", pendingReview: "—", users: "—", newLeads: "—", paidTx: "—", offline: true };
  }
}

export default async function Dashboard() {
  const d = await getDash();
  const cards = [
    { label: "Active listings", value: d.activeListings },
    { label: "Pending review", value: d.pendingReview },
    { label: "Users", value: d.users },
    { label: "New leads", value: d.newLeads },
    { label: "Paid txs", value: d.paidTx },
  ];
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {d.offline ? <p style={{ color: "#B9551B" }}>API offline — demo numbers. Start NestJS + auth for live data.</p> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #ddd" }}>
            <div style={{ fontSize: 13, color: "#4A5A55" }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{String(c.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
