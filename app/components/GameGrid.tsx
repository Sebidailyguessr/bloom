"use client";
import { Color, COLOR_HEX } from "@/lib/grid";

interface Props {
  grid: Color[][];
  territory: Set<string>;
  newCells?: Map<string, number>;  // key → wave depth, from floodFill
  winPhase?: boolean;
}

const MAX_STAGGER_MS = 280; // cap so total expansion anim ≤ 400ms

export default function GameGrid({ grid, territory, newCells, winPhase }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(14, 1fr)",
      gap: 2,
      width: "min(100%, 336px)",
      aspectRatio: "1",
    }}>
      {grid.map((row, r) =>
        row.map((color, c) => {
          const key = `${r}-${c}`;
          const inTerritory = territory.has(key);
          const depth = newCells?.get(key);
          const isNew = depth !== undefined;
          const diagonal = r + c; // for win ripple

          let animation: string | undefined;
          let animDelay: string | undefined;

          if (isNew) {
            const delayMs = Math.min(depth * 15, MAX_STAGGER_MS);
            animation = `bloomIn 120ms ease-out both`;
            animDelay = `${delayMs}ms`;
          } else if (winPhase && inTerritory) {
            animation = `winFlash 150ms ease-out both`;
            animDelay = `${diagonal * 20}ms`;
          }

          return (
            <div
              key={key}
              style={{
                background: COLOR_HEX[color],
                borderRadius: 2,
                opacity: inTerritory ? 1 : 0.72,
                filter: inTerritory && !winPhase ? "brightness(1.12)" : "none",
                boxShadow: inTerritory ? "inset 0 0 0 1px rgba(255,255,255,0.18)" : "none",
                transition: isNew || winPhase ? "none" : "background 0.18s ease, opacity 0.18s ease",
                animation,
                animationDelay: animDelay,
              }}
            />
          );
        })
      )}
    </div>
  );
}
