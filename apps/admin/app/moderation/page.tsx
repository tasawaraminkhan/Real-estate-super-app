"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Row = { id: string; title: string; status: string };

export default function ModerationPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API}/api/v1/admin/moderation`)
      .then((r) => r.json())
      .then((d) => setRows(Array.isArray(d) ? d : d.items || []))
      .catch(() => setMsg("API offline — start NestJS for live queue."));
  }, []);

  async function act(id: string, action: "approve" | "reject") {
    try {
      await fetch(`${API}/api/v1/admin/moderation/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setRows((r) => r.filter((x) => x.id !== id));
    } catch {
      setMsg("Need auth token for moderation actions");
    }
  }

  return (
    <div>
      <h1>Moderation queue</h1>
      {msg ? <p style={{ color: "#B9551B" }}>{msg}</p> : null}
      {rows.length === 0 && !msg ? <p>Queue empty</p> : null}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {rows.map((r) => (
          <li key={r.id} style={{ background: "#fff", marginBottom: 8, padding: 12, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{r.title}</strong>
              <div style={{ fontSize: 13, color: "#4A5A55" }}>{r.status}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => act(r.id, "approve")} style={{ background: "#0D6B5F", color: "#fff", border: 0, padding: "8px 12px", borderRadius: 8 }}>
                Approve
              </button>
              <button type="button" onClick={() => act(r.id, "reject")} style={{ background: "#9B1C1C", color: "#fff", border: 0, padding: "8px 12px", borderRadius: 8 }}>
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
