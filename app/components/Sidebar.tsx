"use client";
import { useEffect, useState } from "react";
import RotatingAlsoPlay from "./RotatingAlsoPlay";

const TOTAL_LEVELS = 300;

const LS = {
  streak:      "bl-streak",
  bestStreak:  "bl-best-streak",
  bestScore:   "bl-best-score",
  gamesPlayed: "bl-games-played",
  levelDone:   (n: number) => `bl-level-done-${n}`,
};

const SCORING: [string, string, string][] = [
  ["par or better", "10,000", "PERFECT BLOOM"],
  ["par + 1",       "9,500",  "MASTER GARDENER"],
  ["par + 2–3",     "8,500",  "KEEN GARDENER"],
  ["par + 4–6",     "7,000",  "GREEN THUMB"],
  ["par + 7+",      "<7,000", "LEARNING TO GROW"],
];

interface Props {
  levelN: number;
  onLevelSelect: (n: number) => void;
}

export default function Sidebar({ levelN, onLevelSelect }: Props) {
  const [streak, setStreak]           = useState(0);
  const [bestStreak, setBestStreak]   = useState(0);
  const [bestScore, setBestScore]     = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [doneLevels, setDoneLevels]   = useState<Set<number>>(new Set());

  useEffect(() => {
    setStreak(parseInt(localStorage.getItem(LS.streak) || "0"));
    setBestStreak(parseInt(localStorage.getItem(LS.bestStreak) || "0"));
    setBestScore(parseInt(localStorage.getItem(LS.bestScore) || "0"));
    setGamesPlayed(parseInt(localStorage.getItem(LS.gamesPlayed) || "0"));

    const done = new Set<number>();
    for (let n = 1; n <= TOTAL_LEVELS; n++) {
      if (localStorage.getItem(LS.levelDone(n)) === "true") done.add(n);
    }
    setDoneLevels(done);
  }, []);

  return (
    <aside className="flex flex-col w-full bg-[#ebdfc4] border-l border-[rgba(42,31,21,0.18)] overflow-y-auto">

      {/* Branding */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <span style={{ fontFamily: "'Caprasimo', serif", fontSize: 18, color: 'var(--ink, #2a1f15)' }}>
          Bloom
        </span>
        <p className="text-[#8a7355] text-xs mt-0.5 font-mono">
          Fill the grid in as few moves as possible.
        </p>
      </div>

      {/* Your Stats */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <h2 className="text-[#8a7355] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">Your Stats</h2>
        {gamesPlayed === 0 ? (
          <p className="text-[#8a7355] text-xs">Play your first game to see stats</p>
        ) : (
          <div className="space-y-2.5">
            {([
              ["🔥", "Streak",       `${streak} day${streak !== 1 ? "s" : ""}`],
              ["⚡", "Best streak",  `${bestStreak} day${bestStreak !== 1 ? "s" : ""}`],
              ["🌸", "Best score",   bestScore.toLocaleString()],
              ["📅", "Games played", String(gamesPlayed)],
            ] as [string, string, string][]).map(([icon, label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-[#5a4632]">{icon} {label}</span>
                <span className="text-[#2a1f15] font-semibold tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Levels */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <h2 className="text-[#8a7355] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">Levels</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 14px)",
          gap: 3,
          maxHeight: 200,
          overflowY: "auto",
        }}>
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(n => {
            const isDone = doneLevels.has(n);
            const isCurrent = n === levelN;
            return (
              <button
                key={n}
                onClick={() => onLevelSelect(n)}
                title={`Level ${n}${isDone ? " ✓" : isCurrent ? " (current)" : ""}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: (isDone || isCurrent) ? "#c45a3a" : "rgba(42,31,21,0.1)",
                  opacity: (isCurrent && !isDone) ? 0.5 : 1,
                  outline: isCurrent ? "2px solid #c45a3a" : "none",
                  outlineOffset: 1,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
        <p className="text-xs mt-2 font-mono">
          <span style={{ color: "#c45a3a" }}>{doneLevels.size}</span>
          <span style={{ color: "#8a7355" }}> / {TOTAL_LEVELS} completed</span>
        </p>
      </div>

      {/* How to Play */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <h2 className="text-[#8a7355] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">How to Play</h2>
        <ol className="space-y-2.5 mb-4">
          {[
            { icon: "🎨", text: "Your territory starts at the top-left corner." },
            { icon: "🌊", text: "Pick a colour — your territory flood-fills to all touching cells of that colour." },
            { icon: "🌸", text: "Fill the entire 14×14 grid with as few moves as possible." },
            { icon: "📊", text: "Score is based on how close you were to the optimal (par) solution." },
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#5a4632] leading-snug">
              <span className="shrink-0 mt-px">{step.icon}</span>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>

        <div className="bg-[var(--paper)] rounded-xl p-3 border border-dashed border-[rgba(42,31,21,0.18)]">
          <p className="text-[#5a4632] text-xs font-semibold uppercase tracking-widest mb-2 font-mono">Scoring</p>
          <div className="space-y-1">
            {SCORING.map(([condition, pts, label]) => (
              <div key={pts} className="flex items-center text-xs gap-2">
                <span className="text-[#8a7355] w-20 shrink-0 font-mono">{condition}</span>
                <span className="text-[#2a1f15] font-semibold tabular-nums w-14 font-mono">{pts}</span>
                <span className="text-[#8a7355]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Also Play */}
      <div className="px-5 py-4 shrink-0">
        <h2 className="text-[#8a7355] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">Also Play</h2>
        <RotatingAlsoPlay />
      </div>

    </aside>
  );
}
