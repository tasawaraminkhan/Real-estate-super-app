export const metadata = { title: "PropVerse Admin", description: "Moderation & ops" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui,sans-serif", background: "#EEF1EC", color: "#0F1C19" }}>
        <header style={{ background: "#0D6B5F", color: "#fff", padding: "12px 20px", fontWeight: 700 }}>
          PropVerse Admin
        </header>
        <nav style={{ display: "flex", gap: 16, padding: "12px 20px", background: "#fff", borderBottom: "1px solid #ddd" }}>
          <a href="/">Dashboard</a>
          <a href="/moderation">Moderation</a>
          <a href="/plans">Plans</a>
        </nav>
        <main style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>{children}</main>
      </body>
    </html>
  );
}
