export const metadata = {
  title: "PropVerse — Pakistan Real Estate",
  description: "Buy, sell, rent — maps, cost engine, trusted listings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui,sans-serif", background: "#EEF1EC", color: "#0F1C19" }}>
        <header style={{ background: "#0D6B5F", color: "#fff", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 18 }}>PropVerse</strong>
          <nav style={{ display: "flex", gap: 16 }}>
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
            <a href="/listings" style={{ color: "#fff", textDecoration: "none" }}>Listings</a>
            <a href="/estimate" style={{ color: "#fff", textDecoration: "none" }}>Cost estimate</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
