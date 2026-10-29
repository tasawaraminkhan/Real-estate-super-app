export default function Home() {
  return (
    <main style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, lineHeight: 1.2, marginBottom: 12 }}>
        Pakistan real estate — maps, cost, trust
      </h1>
      <p style={{ fontSize: 18, color: "#4A5A55", lineHeight: 1.5 }}>
        Buyer 3 taps mein samajh jaye: kahan hai, kitni badi, kitne ki. Seller 5 minute mein listing.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <a href="/listings" style={{ background: "#0D6B5F", color: "#fff", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
          Browse listings
        </a>
        <a href="/estimate" style={{ border: "2px solid #0D6B5F", color: "#0D6B5F", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
          Construction cost
        </a>
      </div>
    </main>
  );
}
