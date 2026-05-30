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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-44px)]">
      <main className="flex-1 min-w-0 flex flex-col items-center">
        <GameClient
          levelN={levelN}
          onLevelChange={handleLevelChange}
          onLevelWin={handleLevelWin}
        />
      </main>
      <Sidebar key={sidebarKey} levelN={levelN} onLevelSelect={handleLevelChange} />
    </div>
  );
}
