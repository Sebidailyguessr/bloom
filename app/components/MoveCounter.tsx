"use client";

interface Props {
  moves: number;
  par?: number;
  gameOver?: boolean;
}

export default function MoveCounter({ moves, par, gameOver }: Props) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 14,
      color: "var(--ink-soft, #5a4632)",
      display: "flex",
      gap: 16,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <span>
        <span style={{ color: "var(--ink, #2a1f15)", fontWeight: 500 }}>{moves}</span>
        {" moves"}
      </span>
      {gameOver && par !== undefined && (
        <span style={{ color: "var(--ink-faded, #8a7355)" }}>
          {"par "}
          <span style={{ color: "var(--terracotta, #c45a3a)" }}>{par}</span>
        </span>
      )}
    </div>
  );
}
