const PLANS = [
  { code: "FREE", price: "0", listings: 3 },
  { code: "STARTER", price: "3,000", listings: 15 },
  { code: "PROFESSIONAL", price: "8,000", listings: 50 },
  { code: "AGENCY", price: "20,000", listings: 200 },
];

export default function PlansPage() {
  return (
    <div>
      <h1>Subscription plans</h1>
      <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 10 }}>Plan</th>
            <th>PKR / mo</th>
            <th>Listings</th>
          </tr>
        </thead>
        <tbody>
          {PLANS.map((p) => (
            <tr key={p.code} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>{p.code}</td>
              <td>{p.price}</td>
              <td>{p.listings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
