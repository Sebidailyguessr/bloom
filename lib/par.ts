import { Color, COLORS, floodFill, isSolved } from "./grid";

export function calculatePar(grid: Color[][]): number {
  let territory = new Set<string>(["0-0"]);
  let currentGrid = grid.map(row => [...row]);
  let moves = 0;

  while (!isSolved(territory)) {
    // Greedy: pick the colour that adds the most cells
    let bestColor: Color = COLORS[0];
    let bestAdded = -1;

    for (const color of COLORS) {
      const currentColor = currentGrid[0][0];
      if (color === currentColor) continue;
      const { cellsAdded } = floodFill(currentGrid, territory, color);
      if (cellsAdded > bestAdded) {
        bestAdded = cellsAdded;
        bestColor = color;
      }
    }

    const result = floodFill(currentGrid, territory, bestColor);
    territory = result.newTerritory;
    currentGrid = result.newGrid;
    moves++;

    // Safety valve — should never hit on a 14×14 grid
    if (moves > 200) break;
  }

  return moves;
}
