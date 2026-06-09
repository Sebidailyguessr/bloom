"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/utils/trackEvent";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DismissMethod = "close_button" | "backdrop" | "escape" | "play";

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
          className={`bg-[#f3e9d6] border border-dashed border-[rgba(42,31,21,0.18)] rounded-2xl max-w-sm w-full shadow-2xl pointer-events-auto transition-transform duration-150 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between px-6 pt-6 pb-4">
            <div>
              <span className="text-2xl">🌸</span>
              <h2
                className="text-[#2a1f15] text-lg font-bold mt-1"
                style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
              >
                One pattern. Grow it.
              </h2>
            </div>
            <button
              onClick={() => handleClose("close_button")}
              className="text-[#8a7355] hover:text-[#2a1f15] transition-colors text-2xl leading-none ml-3 shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="px-6 pb-6">
            <ul
              className="space-y-1 mb-5"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#8a7355" }}
            >
              {[
                "one shot per day",
                "same puzzle for everyone",
                "new puzzle at midnight UTC",
                "free, no account needed",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[#c45a3a]">·</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleClose("play")}
              className="w-full bg-[#c45a3a] hover:bg-[#a14628] text-white font-bold py-3 rounded-xl transition-colors text-sm tracking-wide mb-4"
            >
              Play today&apos;s pattern →
            </button>

            <p
              className="text-center text-xs text-[#8a7355]"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
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
