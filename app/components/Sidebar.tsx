"use client";
import { useEffect, useState } from "react";
import { getPuzzleNumber } from "@/lib/daily";
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
  mode: 'daily' | 'levels';
  isNewUser?: boolean;
  dailyDone?: boolean;
}

export default function Sidebar({ levelN, onLevelSelect, mode, isNewUser = false, dailyDone = false }: Props) {
  const puzzleNumber = getPuzzleNumber()
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
    <aside className="w-full min-h-full bg-[#ebdfc4] border-l border-dashed border-[rgba(42,31,21,0.18)]">

      {/* Branding */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <span style={{ fontFamily: "'Caprasimo', serif", fontSize: 18, color: 'var(--ink, #2a1f15)' }}>
          Bloom
        </span>
        <p className="text-[#8a7355] text-xs mt-0.5 font-mono">
          {mode === 'daily'
            ? `#${String(puzzleNumber).padStart(3, '0')} · Daily flood-fill. One shot.`
            : `Level ${levelN} · 300 levels. No limits.`}
        </p>
      </div>

      {/* Daily hint badge — new users only, daily mode, not done */}
      {isNewUser && !dailyDone && mode === 'daily' && (
        <p className="px-5 py-1.5 text-[#8a7355] border-b border-[rgba(42,31,21,0.08)]"
           style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11 }}>
          🗓 New puzzle every day at midnight UTC
        </p>
      )}

      {/* Your Stats */}
      <div className="px-5 py-4 border-b border-[rgba(42,31,21,0.18)] shrink-0">
        <h2 className="text-[#8a7355] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">Your Stats</h2>
        {mode === 'daily' ? (
          gamesPlayed === 0 ? (
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
          )
        ) : (
          <div className="space-y-2.5">
            {([
              ["📍", "Current level",    String(levelN)],
              ["✅", "Levels completed", `${doneLevels.size} / 300`],
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

      {/* Also on Stoop (new users only) */}
      {isNewUser && (
        <div className="px-5 py-3 border-b border-[rgba(42,31,21,0.18)] shrink-0">
          <p style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#8a7355", lineHeight: 1.7 }}>
            🧩 Also on Stoop:{" "}
            {[
              { label: "dailyguessr.app",   url: "https://dailyguessr.app" },
              { label: "flagguessr.app",    url: "https://flagguessr.app" },
              { label: "cocktailguessr.app",url: "https://cocktailguessr.app" },
              { label: "palette.stoop.games",url: "https://palette.stoop.games" },
              { label: "sortl.stoop.games", url: "https://sortl.stoop.games" },
            ].map((g, i, arr) => (
              <span key={g.url}>
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#c45a3a", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                >
                  {g.label}
                </a>
                {i < arr.length - 1 && <span style={{ color: "#8a7355" }}> · </span>}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Also Play */}
      <div className="px-5 py-4 shrink-0">
        <h2 className="text-[#8a7355] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">Also Play</h2>
        <RotatingAlsoPlay />
      </div>

    </aside>
  );
}
