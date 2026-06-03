"use client";

export default function StoopFooter({ currentGame: _ }: { currentGame: string }) {
  const mono: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  };

  return (
    <footer style={{
      background: "#e5d5b3",
      borderTop: "1px dashed rgba(42,31,21,0.18)",
      padding: "20px 18px 18px",
      marginTop: "auto",
    }}>

      {/* Row 1 — brand */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <a href="https://stoop.games" style={{
          display: "flex", alignItems: "center", gap: 7,
          textDecoration: "none",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#c45a3a",
            boxShadow: "0 0 0 2px #e5d5b3, 0 0 0 3px #c45a3a",
            display: "inline-block", flexShrink: 0,
          }} />
          <span style={{ fontFamily: "'Caprasimo', serif", fontSize: 17, color: "#2a1f15" }}>
            Stoop
          </span>
        </a>

        <div style={{
          ...mono,
          fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#8a7355", textAlign: "right", lineHeight: 1.5,
        }}>
          Tiny Games<br />Every Day
        </div>
      </div>

      {/* Row 2 — links */}
      <div style={{
        display: "flex",
        borderTop: "1px dashed rgba(42,31,21,0.18)",
        paddingTop: 12, marginTop: 2,
      }}>
        {[
          { label: "About",   href: "/about",   border: true },
          { label: "Contact", href: "/contact", border: true },
          { label: "Privacy", href: "/privacy", border: false },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{
              ...mono,
              flex: 1, textAlign: "center",
              fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
              color: "#5a4632", textDecoration: "none",
              borderRight: link.border ? "1px dashed rgba(42,31,21,0.18)" : "none",
              padding: "4px 0",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#c45a3a")}
            onMouseLeave={e => (e.currentTarget.style.color = "#5a4632")}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Row 3 — copyright + ko-fi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <span style={{
          ...mono,
          fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a7355",
        }}>
          © 2026 · Stoop
        </span>

        <a
          href="https://ko-fi.com/stoopgames"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...mono,
            fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em",
            color: "#c45a3a", textDecoration: "none",
            borderBottom: "1px dashed #c45a3a", paddingBottom: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#a14628")}
          onMouseLeave={e => (e.currentTarget.style.color = "#c45a3a")}
        >
          ☕ Ko-fi
        </a>
      </div>
    </footer>
  );
}
