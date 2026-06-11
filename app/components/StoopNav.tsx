"use client";
import { useEffect, useRef, useState } from "react";

const GAMES = [
  { key: "dailyguessr",    label: "DailyGuessr",    domain: "dailyguessr.app",        url: "https://dailyguessr.app",        emoji: "🌍" },
  { key: "flagguessr",     label: "FlagGuessr",     domain: "flagguessr.app",         url: "https://flagguessr.app",         emoji: "🏳️" },
  { key: "cocktailguessr", label: "CocktailGuessr", domain: "cocktailguessr.app",     url: "https://cocktailguessr.app",     emoji: "🍹" },
  { key: "palette",        label: "Palette",        domain: "palette.stoop.games",    url: "https://palette.stoop.games",   emoji: "🎨" },
  { key: "bloom",          label: "Bloom",          domain: "bloom.stoop.games",      url: "https://bloom.stoop.games",     emoji: "🌸" },
  { key: "sortl",          label: "Sortl",          domain: "sortl.stoop.games",      url: "https://sortl.stoop.games",     emoji: "🧪" },
  { key: "higher",         label: "Higher/Lower",   domain: "higher.stoop.games",     url: "https://higher.stoop.games",    emoji: "↕️" },
];

const DAILY_GAMES = [
  { key: "dailyguessr",    label: "DailyGuessr",    url: "https://dailyguessr.app",     emoji: "🌍" },
  { key: "flagguessr",     label: "FlagGuessr",     url: "https://flagguessr.app",      emoji: "🏳️" },
  { key: "cocktailguessr", label: "CocktailGuessr", url: "https://cocktailguessr.app",  emoji: "🍹" },
];

const ARCADE_GAMES = [
  { key: "palette", label: "Palette", url: "https://palette.stoop.games", emoji: "🎨" },
  { key: "bloom",   label: "Bloom",   url: "https://bloom.stoop.games",   emoji: "🌸" },
  { key: "sortl",   label: "Sortl",   url: "https://sortl.stoop.games",   emoji: "🧪" },
  { key: "higher",  label: "Higher/Lower", url: "https://higher.stoop.games", emoji: "↕️" },
];

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const DESKTOP_NAV_CSS = `
  .stoop-mobile { display: block; }
  .stoop-desktop-nav { display: none; }
  @media (min-width: 1024px) {
    .stoop-mobile { display: none; }
    .stoop-desktop-nav { display: flex; }
  }
  .stoop-nav-link {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5a4632;
    text-decoration: none;
    transition: color 150ms ease;
    white-space: nowrap;
  }
  .stoop-nav-link:hover { color: #c45a3a; }
  .stoop-nav-link.stoop-active {
    color: #c45a3a;
    border-bottom: 1px solid #c45a3a;
  }
  .stoop-group { overflow-x: auto; scrollbar-width: none; }
  .stoop-group::-webkit-scrollbar { display: none; }
`;

export default function StoopNav({ currentGame }: { currentGame: string }) {
  const [dateStr, setDateStr] = useState("");
  const [open, setOpen]       = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = new Date();
    setDateStr(`${DAYS[d.getDay()]} ${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]}`);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#8a7355",
    flexShrink: 0,
  };

  const separatorStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    color: "#8a7355",
    opacity: 0.4,
    margin: "0 10px",
    flexShrink: 0,
  };

  return (
    <div ref={navRef} style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <style>{DESKTOP_NAV_CSS}</style>

      {/* Mobile: hamburger bar + drawer — unchanged */}
      <div className="stoop-mobile">
        <nav style={{
          background: "#f3e9d6",
          borderBottom: "1px dashed rgba(42,31,21,0.18)",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          height: 44,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          position: "relative",
        }}>
          {/* LEFT — hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            style={{
              width: 36, height: 36,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              flexShrink: 0,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block",
                height: 1.5,
                background: "#2a1f15",
                borderRadius: 2,
                transformOrigin: "center",
                transition: "transform 220ms ease, opacity 220ms ease, width 220ms ease",
                width: i === 1
                  ? (open ? 0    : 18)
                  : 18,
                opacity: i === 1 && open ? 0 : 1,
                transform: i === 0 && open
                  ? "translateY(6px) rotate(45deg)"
                  : i === 2 && open
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
              }} />
            ))}
          </button>

          {/* CENTER — logo, absolutely centered */}
          <a
            href="https://stoop.games"
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: "'Caprasimo', serif",
              fontSize: 18, color: "var(--ink, #2a1f15)",
              textDecoration: "none",
            }}
          >
            <span style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "#c45a3a",
              boxShadow: "0 0 0 2.5px #f3e9d6, 0 0 0 3.5px #c45a3a",
              display: "inline-block",
              flexShrink: 0,
            }} />
            Stoop
          </a>

          {/* RIGHT — date */}
          <span style={{
            marginLeft: "auto",
            fontSize: 10, letterSpacing: "0.08em",
            color: "var(--ink-faded, #8a7355)", flexShrink: 0,
          }}>{dateStr}</span>
        </nav>

        {/* Drawer */}
        <div style={{
          background: "#ebdfc4",
          borderBottom: open ? "1px dashed rgba(42,31,21,0.18)" : "none",
          overflow: "hidden",
          maxHeight: open ? 320 : 0,
          transition: "max-height 250ms ease",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        }}>
          <div style={{
            fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em",
            color: "#8a7355", padding: "10px 16px 6px",
          }}>
            Games
          </div>

          {GAMES.map(g => {
            const isActive  = g.key === currentGame;
            const isHovered = g.key === hoveredKey;
            return (
              <a
                key={g.key}
                href={g.url}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setHoveredKey(g.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 16px",
                  textDecoration: "none",
                  background: isActive ? "rgba(42,31,21,0.07)" : "transparent",
                }}
              >
                {/* Emoji icon */}
                <span style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "#e5d5b3",
                  border: "1px dashed rgba(42,31,21,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, flexShrink: 0,
                }}>
                  {g.emoji}
                </span>

                {/* Name + domain */}
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{
                    fontFamily: "'Caprasimo', serif",
                    fontSize: 13, color: "#2a1f15", lineHeight: 1.2,
                  }}>
                    {g.label}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 9, color: "#8a7355", marginTop: 1,
                  }}>
                    {g.domain}
                  </span>
                </span>

                {/* Arrow */}
                <span style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11, color: "#c45a3a",
                  marginLeft: "auto",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 150ms ease",
                }}>
                  →
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Desktop: horizontal nav — hidden on mobile */}
      <nav
        className="stoop-desktop-nav"
        style={{
          background: "#f3e9d6",
          borderBottom: "1px dashed rgba(42,31,21,0.18)",
          height: 44,
          alignItems: "center",
          padding: "0 40px",
          position: "relative",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        }}
      >
        {/* LEFT: DAILY | 🌍 DailyGuessr · 🏳️ FlagGuessr · 🍹 CocktailGuessr */}
        <div className="stoop-group" style={{ display: "flex", alignItems: "center" }}>
          <span style={labelStyle}>DAILY</span>
          <span style={separatorStyle}>|</span>
          <div style={{ display: "flex", gap: 18 }}>
            {DAILY_GAMES.map(g => (
              <a
                key={g.key}
                href={g.url}
                className={"stoop-nav-link" + (g.key === currentGame ? " stoop-active" : "")}
              >
                {g.emoji} {g.label}
              </a>
            ))}
          </div>
        </div>

        {/* CENTER: Stoop logo, absolutely centered */}
        <a
          href="https://stoop.games"
          style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Caprasimo', serif",
            fontSize: 18, color: "var(--ink, #2a1f15)",
            textDecoration: "none",
          }}
        >
          <span style={{
            width: 9, height: 9, borderRadius: "50%",
            background: "#c45a3a",
            boxShadow: "0 0 0 2.5px #f3e9d6, 0 0 0 3.5px #c45a3a",
            display: "inline-block",
            flexShrink: 0,
          }} />
          Stoop
        </a>

        {/* RIGHT: 🎨 Palette · 🌸 Bloom · 🧪 Sortl | ARCADE */}
        <div className="stoop-group" style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 18 }}>
            {ARCADE_GAMES.map(g => (
              <a
                key={g.key}
                href={g.url}
                className={"stoop-nav-link" + (g.key === currentGame ? " stoop-active" : "")}
              >
                {g.emoji} {g.label}
              </a>
            ))}
          </div>
          <span style={separatorStyle}>|</span>
          <span style={labelStyle}>ARCADE</span>
        </div>
      </nav>
    </div>
  );
}
