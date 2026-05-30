"use client";
import { useState } from "react";
import { Color, COLORS, COLOR_HEX } from "@/lib/grid";

interface Props {
  currentColor: Color;
  onPick: (color: Color) => void;
  disabled?: boolean;
}

export default function ColorPicker({ currentColor, onPick, disabled }: Props) {
  const [pulsing, setPulsing] = useState<Color | null>(null);

  const handleClick = (color: Color) => {
    if (color === currentColor || disabled) return;
    setPulsing(color);
    onPick(color);
    setTimeout(() => setPulsing(null), 80);
  };

  return (
    <div style={{
      display: "flex",
      gap: 10,
      justifyContent: "center",
      flexWrap: "wrap",
    }}>
      {COLORS.map(color => {
        const isCurrent = color === currentColor;
        const isPulsing = pulsing === color;
        return (
          <button
            key={color}
            onClick={() => handleClick(color)}
            disabled={isCurrent || disabled}
            aria-label={color}
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: COLOR_HEX[color],
              border: isCurrent
                ? "3px solid var(--ink, #2a1f15)"
                : "3px solid transparent",
              outline: isCurrent ? "2px solid rgba(255,255,255,0.5)" : "none",
              outlineOffset: "-4px",
              cursor: isCurrent || disabled ? "default" : "pointer",
              opacity: isCurrent ? 0.5 : disabled && !isCurrent ? 0.7 : 1,
              animation: isPulsing ? "colorPulse 80ms ease-out both" : undefined,
            }}
            onMouseEnter={e => {
              if (!isCurrent && !disabled)
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          />
        );
      })}
    </div>
  );
}
