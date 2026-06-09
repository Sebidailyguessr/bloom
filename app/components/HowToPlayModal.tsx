"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/utils/trackEvent";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DismissMethod = "close_button" | "backdrop" | "escape" | "play";

const STEPS = [
  { icon: "🎨", title: "Start at the corner",  desc: "Your territory starts at the top-left corner." },
  { icon: "🌊", title: "Pick a colour",         desc: "Pick a colour — your territory flood-fills to all touching cells of that colour." },
  { icon: "🌸", title: "Fill the grid",         desc: "Fill the entire 14×14 grid with as few moves as possible." },
  { icon: "📊", title: "Beat par",              desc: "Score is based on how close you were to the optimal (par) solution." },
];

const COLOURS = [
  { name: "Terracotta", hex: "#c45a3a" },
  { name: "Ochre",      hex: "#d49a3a" },
  { name: "Sage",       hex: "#7a8a5e" },
  { name: "Plum",       hex: "#6b4858" },
  { name: "Slate",      hex: "#5a6872" },
  { name: "Ink",        hex: "#3d2e1e" },
];

const SCORING: [string, string, string][] = [
  ["par or better", "10,000", "PERFECT BLOOM"],
  ["par + 1",       "9,500",  "MASTER GARDENER"],
  ["par + 2–3",     "8,500",  "KEEN GARDENER"],
  ["par + 4–6",     "7,000",  "GREEN THUMB"],
  ["par + 7+",      "<7,000", "LEARNING TO GROW"],
];

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const handleClose = (method: DismissMethod) => {
    trackEvent("onboarding_dismissed", { game: "bl", method });
    setVisible(false);
    setTimeout(onClose, 150);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose("escape"); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-150 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => handleClose("backdrop")}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-opacity duration-150 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-[#f3e9d6] border border-dashed border-[rgba(42,31,21,0.18)] rounded-2xl max-w-md w-full max-h-[90dvh] flex flex-col shadow-2xl pointer-events-auto transition-transform duration-150 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
            <h2 className="text-[#2a1f15] text-xl font-bold tracking-wide">How to Play</h2>
            <button
              onClick={() => handleClose("close_button")}
              className="text-[#8a7355] hover:text-[#2a1f15] transition-colors text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-6 pb-6">

            {/* Steps */}
            <ol className="space-y-3 mb-5">
              {STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 shrink-0">{step.icon}</span>
                  <div>
                    <span className="text-[#2a1f15] font-semibold text-sm">{step.title}</span>
                    <p className="text-[#5a4632] text-sm leading-snug">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* THE SIX COLOURS (Bloom-specific) */}
            <div className="bg-[#ebdfc4] rounded-xl p-4 mb-5 border border-dashed border-[rgba(42,31,21,0.18)]">
              <p className="text-[#5a4632] text-xs font-semibold uppercase tracking-widest mb-3 font-mono">The Six Colours</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {COLOURS.map(({ name, hex }) => (
                  <div key={name} className="flex items-center gap-2 text-sm text-[#5a4632]">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ background: hex }}
                    />
                    {name}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#8a7355] font-mono mt-3">
                Every grid uses exactly these six colours.
              </p>
            </div>

            {/* SCORING */}
            <div className="bg-[#ebdfc4] rounded-xl p-4 mb-5 border border-dashed border-[rgba(42,31,21,0.18)]">
              <p className="text-[#5a4632] text-xs font-semibold uppercase tracking-widest mb-1 font-mono">Scoring</p>
              <p className="text-xs text-[#8a7355] font-mono mb-3">Par = optimal number of moves for today&apos;s grid.</p>
              <div className="space-y-1">
                {SCORING.map(([condition, pts, label]) => (
                  <div key={condition} className="flex items-center text-sm gap-2">
                    <span className="text-[#8a7355] w-20 shrink-0 font-mono text-xs">{condition}</span>
                    <span className="text-[#2a1f15] font-semibold tabular-nums w-14 shrink-0 font-mono">{pts}</span>
                    <span className="text-[#5a4632]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleClose("play")}
              className="w-full bg-[#c45a3a] hover:bg-[#a14628] text-white font-bold py-3 rounded-xl transition-colors text-sm tracking-wide"
            >
              Let&apos;s play! 🌸
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-[#8a7355] font-mono mt-4">
              Part of{" "}
              <a
                href="https://stoop.games"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c45a3a] hover:underline"
              >
                Stoop
              </a>
              {" "}— 6 daily puzzle games
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
