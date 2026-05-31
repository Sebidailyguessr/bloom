"use client";
import { useState, useEffect } from "react";
import GameClient from "./components/GameClient";
import Sidebar from "./components/Sidebar";

const TOTAL_LEVELS = 300;

export default function HomePage() {
  const [levelN, setLevelN] = useState(1);
  const [sidebarKey, setSidebarKey] = useState(0);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem("bl-current-level") || "1");
    setLevelN(Math.min(Math.max(1, saved), TOTAL_LEVELS));
  }, []);

  const handleLevelChange = (n: number) => {
    const clamped = Math.min(Math.max(1, n), TOTAL_LEVELS);
    localStorage.setItem("bl-current-level", String(clamped));
    setLevelN(clamped);
    setSidebarKey(k => k + 1);
  };

  const handleLevelWin = () => {
    setSidebarKey(k => k + 1);
  };

  return (
    <div className="w-full px-4 flex gap-6 py-6 items-start">

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <GameClient
            levelN={levelN}
            onLevelChange={handleLevelChange}
            onLevelWin={handleLevelWin}
          />
        </div>
      </div>

      {/* Sidebar — key forces remount after win so stats refresh */}
      <div className="hidden lg:block w-72 shrink-0">
        <Sidebar key={sidebarKey} levelN={levelN} onLevelSelect={handleLevelChange} />
      </div>

    </div>
  );
}
