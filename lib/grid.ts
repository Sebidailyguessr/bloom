export type Color = "terracotta" | "ochre" | "sage" | "plum" | "slate" | "ink-dark";

export const COLORS: Color[] = ["terracotta", "ochre", "sage", "plum", "slate", "ink-dark"];

export const COLOR_HEX: Record<Color, string> = {
  terracotta: "#c45a3a",
  ochre:      "#d49a3a",
  sage:       "#7a8a5e",
  plum:       "#6b4858",
  slate:      "#5a6872",
  "ink-dark": "#3d2e1e",
};

const GRID_SIZE = 14;

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 0x100000000;
  };
}

function seedFromString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateGrid(seed: string): Color[][] {
  const rand = lcg(seedFromString(seed));
  const grid: Color[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: Color[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push(COLORS[Math.floor(rand() * COLORS.length)]);
    }
    grid.push(row);
  }
  return grid;
}

export function floodFill(
  grid: Color[][],
  territory: Set<string>,
  color: Color,
): { newGrid: Color[][]; newTerritory: Set<string>; cellsAdded: number; waveDepths: Map<string, number> } {
  const newGrid = grid.map(row => [...row]);
  for (const key of territory) {
    const [r, c] = key.split("-").map(Number);
    newGrid[r][c] = color;
  }

  const newTerritory = new Set(territory);
  const waveDepths = new Map<string, number>();
  const queue: [number, number][] = [];

  // Seed depth-1 cells from territory border
  for (const key of territory) {
    const [r, c] = key.split("-").map(Number);
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        const nk = `${nr}-${nc}`;
        if (!newTerritory.has(nk) && grid[nr][nc] === color) {
          newTerritory.add(nk);
          waveDepths.set(nk, 1);
          newGrid[nr][nc] = color;
          queue.push([nr, nc]);
        }
      }
    }
  }

  // BFS expand, tracking depth
  let i = 0;
  while (i < queue.length) {
    const [r, c] = queue[i++];
    const depth = waveDepths.get(`${r}-${c}`)!;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        const nk = `${nr}-${nc}`;
        if (!newTerritory.has(nk) && grid[nr][nc] === color) {
          newTerritory.add(nk);
          waveDepths.set(nk, depth + 1);
          newGrid[nr][nc] = color;
          queue.push([nr, nc]);
        }
      }
    }
  }

  const cellsAdded = newTerritory.size - territory.size;
  return { newGrid, newTerritory, cellsAdded, waveDepths };
}

export function isSolved(territory: Set<string>): boolean {
  return territory.size === GRID_SIZE * GRID_SIZE;
}

export function getAdjacentColors(grid: Color[][], territory: Set<string>): Color[] {
  const found = new Set<Color>();
  for (const key of territory) {
    const [r, c] = key.split("-").map(Number);
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        const nk = `${nr}-${nc}`;
        if (!territory.has(nk)) {
          found.add(grid[nr][nc]);
        }
      }
    }
  }
  return Array.from(found);
}
