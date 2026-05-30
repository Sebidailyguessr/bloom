"use client";
import { useEffect, useState } from "react";
import RotatingAlsoPlay from "./RotatingAlsoPlay";

const LS = {
  streak:       "bl-streak",
  bestStreak:   "bl-best-streak",
  bestScore:    "bl-best-score",
  gamesPlayed:  "bl-games-played",
  practiceBest: "bl-practice-best",
};

const SCORING: [string, string, string][] = [
  ["10,000", "PERFECT BLOOM",    "par or better"],
  ["9,500",  "MASTER GARDENER",  "par + 1"],
  ["8,500",  "KEEN GARDENER",    "par + 2–3"],
  ["7,000",  "GREEN THUMB",      "par + 4–6"],
  ["<7,000", "LEARNING TO GROW", "par + 7+"],
];


export default function Sidebar() {
  const [streak, setStreak]           = useState(0);
  const [bestStreak, setBestStreak]   = useState(0);
  const [bestScore, setBestScore]     = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    setStreak(parseInt(localStorage.getItem(LS.streak) || "0"));
    setBestStreak(parseInt(localStorage.getItem(LS.bestStreak) || "0"));
    setBestScore(parseInt(localStorage.getItem(LS.bestScore) || "0"));
    setGamesPlayed(parseInt(localStorage.getItem(LS.gamesPlayed) || "0"));
  }, []);

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-[#ebdfc4] border-l border-[rgba(42,31,21,0.18)] overflow-y-auto lg:sticky lg:top-[44px] lg:self-start lg:max-h-[calc(100vh-44px)]">

      {/* Branding */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <span className="text-[#2a1f15] font-bold tracking-tight select-none text-lg"
          style={{ fontFamily: "'Caprasimo', serif" }}>
          Bloom
        </span>
        <p className="text-[#8a7355] text-xs mt-0.5 font-mono">
          Daily flood-fill colour game
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

        {/* Scoring table */}
        <div className="bg-[var(--paper)] rounded-xl p-3 border border-dashed border-[rgba(42,31,21,0.18)]">
          <p className="text-[#5a4632] text-xs font-semibold uppercase tracking-widest mb-2 font-mono">Scoring</p>
          <div className="space-y-1">
            {SCORING.map(([pts, label]) => (
              <div key={pts} className="flex items-center text-xs gap-2">
                <span className="text-[#c45a3a] font-semibold tabular-nums w-14 shrink-0">{pts}</span>
                <span className="text-[#8a7355] truncate">{label}</span>
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
