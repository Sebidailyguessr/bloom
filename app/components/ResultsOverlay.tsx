"use client";

interface Props {
  moves: number;
  par: number;
  puzzleNumber: number;
  mode: "daily" | "practice";
  onClose?: () => void;
}

function getLabel(score: number): string {
  if (score === 10000) return "PERFECT BLOOM";
  if (score >= 9500)  return "MASTER GARDENER";
  if (score >= 8500)  return "KEEN GARDENER";
  if (score >= 7000)  return "GREEN THUMB";
  return "LEARNING TO GROW";
}

function getScore(moves: number, par: number): number {
  return Math.max(0, 10000 - (moves - par) * 500);
}

export default function ResultsOverlay({ moves, par, puzzleNumber, mode, onClose }: Props) {
  const score = getScore(moves, par);
  const label = getLabel(score);

  const shareText = mode === "daily"
    ? `🌸 Bloom #${String(puzzleNumber).padStart(3, "0")}\n${label}\n${moves} moves · par ${par}\nbloom.stoop.games`
    : `🌸 Bloom (Practice)\n${label}\n${moves} moves · par ${par}\nbloom.stoop.games`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(42,31,21,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      animation: "overlayFadeIn 300ms ease-out both",
    }} onClick={onClose}>
      <div style={{
        background: "var(--paper, #f3e9d6)",
        border: "1px dashed rgba(42,31,21,0.18)",
        borderRadius: 12,
        padding: "32px 28px",
        maxWidth: 340,
        width: "100%",
        textAlign: "center",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          fontFamily: "'Caprasimo', serif",
          fontSize: 28,
          color: "var(--ink, #2a1f15)",
          marginBottom: 4,
        }}>🌸 Bloom</div>

        {mode === "daily" && (
          <div style={{ fontSize: 11, color: "var(--ink-faded)", letterSpacing: "0.1em", marginBottom: 20 }}>
            #{String(puzzleNumber).padStart(3, "0")}
          </div>
        )}

        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--terracotta, #c45a3a)",
          letterSpacing: "0.12em",
          marginBottom: 8,
        }}>{label}</div>

        <div style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--ink, #2a1f15)",
          marginBottom: 4,
        }}>{score.toLocaleString()}</div>

        <div style={{ fontSize: 12, color: "var(--ink-faded)", marginBottom: 24 }}>
          {moves} moves · par {par}
        </div>

        <button onClick={handleShare} style={{
          background: "var(--terracotta, #c45a3a)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "12px 28px",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          width: "100%",
          marginBottom: 10,
        }}>Share result</button>

        {onClose && (
          <button onClick={onClose} style={{
            background: "transparent",
            color: "var(--ink-faded)",
            border: "1px dashed rgba(42,31,21,0.18)",
            borderRadius: 8,
            padding: "10px 28px",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            width: "100%",
          }}>Close</button>
        )}
      </div>
    </div>
  );
}
