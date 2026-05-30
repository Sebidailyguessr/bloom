import { generateGrid, Color } from "./grid";

const EPOCH = new Date("2026-06-01");

export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getPuzzleNumber(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const epoch = new Date(EPOCH);
  epoch.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - epoch.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

export function getDailyGrid(): Color[][] {
  return generateGrid(getTodayKey());
}

export function getLevelGrid(n: number): Color[][] {
  return generateGrid(`level-${n}`);
}
