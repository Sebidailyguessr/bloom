"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Color, floodFill, isSolved } from "@/lib/grid";
import { calculatePar } from "@/lib/par";
import { getDailyGrid, getPracticeGrid, getTodayKey, getPuzzleNumber } from "@/lib/daily";
import GameGrid from "./GameGrid";
import ColorPicker from "./ColorPicker";
import MoveCounter from "./MoveCounter";
import ResultsOverlay from "./ResultsOverlay";

type Mode = "daily" | "practice";

const LS = {
  state:       (key: string) => `bl-state-${key}`,
  streak:      "bl-streak",
  bestStreak:  "bl-best-streak",
  bestScore:   "bl-best-score",
  gamesPlayed: "bl-games-played",
  practiceBest:"bl-practice-best",
};

function calcScore(moves: number, par: number) {
  return Math.max(0, 10000 - (moves - par) * 500);
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export default function GameClient() {
  const [mode, setMode] = useState<Mode>("daily");
  const [practiceN, setPracticeN] = useState(1);
  const [grid, setGrid] = useState<Color[][]>([]);
  const [territory, setTerritory] = useState<Set<string>>(new Set(["0-0"]));
  const [moves, setMoves] = useState(0);
  const [par, setPar] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dailyDone, setDailyDone] = useState(false);

  // Animation state
  const [newCells, setNewCells] = useState<Map<string, number>>(new Map());
  const [animating, setAnimating] = useState(false);
  const [winPhase, setWinPhase] = useState(false);

  // Stats
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [practiceBest, setPracticeBest] = useState(0);

  // Always-current snapshot for handleMove (avoids stale closures)
  const stateRef = useRef({
    grid, territory, moves, par, mode, gameOver, animating,
    streak, bestStreak, bestScore, gamesPlayed, practiceBest,
  });
  useEffect(() => {
    stateRef.current = {
      grid, territory, moves, par, mode, gameOver, animating,
      streak, bestStreak, bestScore, gamesPlayed, practiceBest,
    };
  });

  // Load stats & daily state from localStorage on mount
  useEffect(() => {
    setStreak(parseInt(localStorage.getItem(LS.streak) || "0"));
    setBestStreak(parseInt(localStorage.getItem(LS.bestStreak) || "0"));
    setBestScore(parseInt(localStorage.getItem(LS.bestScore) || "0"));
    setGamesPlayed(parseInt(localStorage.getItem(LS.gamesPlayed) || "0"));
    setPracticeBest(parseInt(localStorage.getItem(LS.practiceBest) || "0"));

    const key = getTodayKey();
    const saved = localStorage.getItem(LS.state(key));
    if (saved) {
      try { if (JSON.parse(saved).gameOver) setDailyDone(true); } catch { /* ignore */ }
    }
  }, []);

  // Init / reset game when mode or practiceN changes
  useEffect(() => {
    const baseGrid = mode === "daily" ? getDailyGrid() : getPracticeGrid(practiceN);

    if (mode === "daily") {
      const key = getTodayKey();
      const saved = localStorage.getItem(LS.state(key));
      if (saved) {
        try {
          const s = JSON.parse(saved);
          setGrid(s.grid);
          setTerritory(new Set<string>(s.territory));
          setMoves(s.moves);
          setGameOver(s.gameOver);
          setShowResults(false);
          setPar(calculatePar(baseGrid));
          setNewCells(new Map());
          setAnimating(false);
          setWinPhase(false);
          return;
        } catch { /* fall through */ }
      }
    }

    setGrid(baseGrid);
    setTerritory(new Set<string>(["0-0"]));
    setMoves(0);
    setGameOver(false);
    setShowResults(false);
    setPar(calculatePar(baseGrid));
    setNewCells(new Map());
    setAnimating(false);
    setWinPhase(false);
  }, [mode, practiceN]);

  const handleMove = useCallback((color: Color) => {
    const s = stateRef.current;
    if (s.gameOver || s.animating) return;

    const { newGrid, newTerritory, waveDepths } = floodFill(s.grid, s.territory, color);
    const newMoves = s.moves + 1;

    setGrid(newGrid);
    setTerritory(newTerritory);
    setMoves(newMoves);
    setNewCells(waveDepths);
    setAnimating(true);

    // Clear bloom animation after it finishes
    const maxDepth = waveDepths.size > 0 ? Math.max(...waveDepths.values()) : 0;
    const bloomDuration = Math.min(maxDepth * 15, 280) + 120;

    const solved = isSolved(newTerritory);

    setTimeout(() => {
      setAnimating(false);
      setNewCells(new Map());
      if (solved) setWinPhase(true);
    }, bloomDuration);

    if (solved) {
      setGameOver(true);
      // Overlay fades in 600ms after win
      setTimeout(() => setShowResults(true), 600);

      const score = calcScore(newMoves, s.par);

      if (s.mode === "daily") {
        const key = getTodayKey();
        localStorage.setItem(LS.state(key), JSON.stringify({
          grid: newGrid, territory: Array.from(newTerritory),
          moves: newMoves, gameOver: true,
        }));

        const yState = localStorage.getItem(LS.state(getYesterdayKey()));
        let hadYesterday = false;
        try { hadYesterday = yState ? JSON.parse(yState).gameOver : false; } catch { /* ignore */ }
        const newStreak = hadYesterday ? s.streak + 1 : 1;
        const newBestStreak = Math.max(s.bestStreak, newStreak);
        localStorage.setItem(LS.streak, String(newStreak));
        localStorage.setItem(LS.bestStreak, String(newBestStreak));
        setStreak(newStreak);
        setBestStreak(newBestStreak);
        setDailyDone(true);

        const newBestScore = Math.max(s.bestScore, score);
        localStorage.setItem(LS.bestScore, String(newBestScore));
        setBestScore(newBestScore);
      } else {
        const newPracticeBest = Math.max(s.practiceBest, score);
        localStorage.setItem(LS.practiceBest, String(newPracticeBest));
        setPracticeBest(newPracticeBest);
      }

      const newGamesPlayed = s.gamesPlayed + 1;
      localStorage.setItem(LS.gamesPlayed, String(newGamesPlayed));
      setGamesPlayed(newGamesPlayed);
    } else if (s.mode === "daily") {
      const key = getTodayKey();
      localStorage.setItem(LS.state(key), JSON.stringify({
        grid: newGrid, territory: Array.from(newTerritory),
        moves: newMoves, gameOver: false,
      }));
    }
  }, []); // reads via stateRef

  const currentColor = grid[0]?.[0];
  if (!grid.length) return null;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      padding: "24px 16px",
    }}>
      {/* Mode tabs */}
      <div style={{
        display: "flex",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px dashed rgba(42,31,21,0.18)",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        {(["daily", "practice"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "8px 20px",
            background: mode === m ? "var(--terracotta, #c45a3a)" : "transparent",
            color: mode === m ? "#fff" : "var(--ink-soft, #5a4632)",
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}>{m}</button>
        ))}
      </div>

      {/* Puzzle label */}
      <div style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 11,
        color: "var(--ink-faded, #8a7355)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        {mode === "daily"
          ? `Bloom #${String(getPuzzleNumber()).padStart(3, "0")}`
          : `Practice #${practiceN}`}
      </div>

      <GameGrid
        grid={grid}
        territory={territory}
        newCells={newCells.size > 0 ? newCells : undefined}
        winPhase={winPhase}
      />

      <MoveCounter moves={moves} par={par} gameOver={gameOver} />

      <ColorPicker
        currentColor={currentColor}
        onPick={handleMove}
        disabled={gameOver || animating}
      />

      {mode === "practice" && (
        <button onClick={() => setPracticeN(n => n + 1)} style={{
          background: "transparent",
          border: "1px dashed rgba(42,31,21,0.18)",
          borderRadius: 8,
          padding: "10px 24px",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-soft, #5a4632)",
          cursor: "pointer",
        }}>New puzzle</button>
      )}

      {mode === "daily" && dailyDone && !showResults && (
        <button onClick={() => setShowResults(true)} style={{
          background: "transparent",
          border: "1px dashed rgba(42,31,21,0.18)",
          borderRadius: 8,
          padding: "10px 24px",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-soft, #5a4632)",
          cursor: "pointer",
        }}>Show result</button>
      )}

      {showResults && (
        <ResultsOverlay
          moves={moves}
          par={par}
          puzzleNumber={getPuzzleNumber()}
          mode={mode}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
