"use client";

export default function StoopFooter() {
  return (
    <footer style={{
      borderTop: "1px dashed rgba(42,31,21,0.18)",
      background: "var(--paper, #f3e9d6)",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      marginTop: 48,
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
      }}>
        <a href="https://stoop.games" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em",
          color: "var(--ink-soft, #5a4632)", textDecoration: "none",
        }}>
          Part of
          <span style={{ fontFamily: "'Caprasimo', serif", fontSize: 14,
            color: "var(--ink, #2a1f15)", textTransform: "none", letterSpacing: 0 }}>
            Stoop
          </span>
        </a>

        <div style={{ display: "flex", gap: 16, fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {[
            { label: "DailyGuessr",    href: "https://dailyguessr.app" },
            { label: "FlagGuessr",     href: "https://flagguessr.app" },
            { label: "CocktailGuessr", href: "https://cocktailguessr.app" },
            { label: "Palette",        href: "https://palette.stoop.games" },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              color: "var(--ink-faded, #8a7355)", textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#c45a3a")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faded, #8a7355)")}
            >{link.label}</a>
          ))}
        </div>

        <span style={{ fontSize: 10, letterSpacing: "0.08em",
          color: "var(--ink-faded, #8a7355)" }}>© 2026 · Stoop</span>
      </div>
    </footer>
  );
}
