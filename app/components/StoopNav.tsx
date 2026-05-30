"use client";
import { useEffect, useState } from "react";

const GAMES = [
  { key: "dailyguessr",    label: "DailyGuessr",    url: "https://dailyguessr.app" },
  { key: "flagguessr",     label: "FlagGuessr",      url: "https://flagguessr.app" },
  { key: "cocktailguessr", label: "CocktailGuessr",  url: "https://cocktailguessr.app" },
  { key: "palette",        label: "Palette",          url: "https://palette.stoop.games" },
  { key: "bloom",          label: "Bloom",            url: "https://bloom.stoop.games" },
];

const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

export default function StoopNav({ currentGame }: { currentGame: string }) {
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    const d = new Date();
    setDateStr(`${DAYS[d.getDay()]} ${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]}`);
  }, []);

  return (
    <nav style={{
      background: "var(--paper, #f3e9d6)",
      borderBottom: "1px dashed rgba(42,31,21,0.18)",
      position: "sticky", top: 0, zIndex: 50,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto",
        padding: "0 24px",
        height: 44,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <a href="https://stoop.games" style={{
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "'Caprasimo', serif",
          fontSize: 18, color: "var(--ink, #2a1f15)",
          textDecoration: "none", flexShrink: 0,
        }}>
          <span style={{
            width: 9, height: 9, borderRadius: "50%",
            background: "#c45a3a",
            boxShadow: "0 0 0 2.5px var(--paper,#f3e9d6), 0 0 0 3.5px #c45a3a",
            display: "inline-block",
          }} />
          Stoop
        </a>

        <div style={{
          display: "flex", gap: 20, alignItems: "center",
          fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em",
        }} className="stoop-gamenav">
          {GAMES.map(g => (
            <a key={g.key} href={g.url} style={{
              color: g.key === currentGame ? "#c45a3a" : "var(--ink-soft, #5a4632)",
              textDecoration: "none",
              borderBottom: g.key === currentGame ? "1px solid #c45a3a" : "1px solid transparent",
              paddingBottom: 2,
            }}>{g.label}</a>
          ))}
        </div>

        <span style={{
          fontSize: 10, letterSpacing: "0.08em",
          color: "var(--ink-faded, #8a7355)", flexShrink: 0,
        }}>{dateStr}</span>
      </div>

      <style>{`.stoop-gamenav { display: flex; } @media(max-width:600px){ .stoop-gamenav { display: none; } }`}</style>
    </nav>
  );
}
