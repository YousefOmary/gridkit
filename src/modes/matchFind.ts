/** Run detection for match-3 style boards. */

import { indexOf, swapCells } from '../engine/grid';
import type { Board, TileId } from '../engine/types';

/** A straight horizontal or vertical run of 3+ identical tiles. */
export interface Run {
  tile: TileId;
  cells: number[];
}

/** Find every horizontal and vertical run of 3 or more identical tiles. */
export function findRuns(board: Board): Run[] {
  const runs: Run[] = [];
  const scanLine = (line: number[]): void => {
    let start = 0;
    for (let i = 1; i <= line.length; i++) {
      const tile = board.cells[line[start]].tile;
      const same = i < line.length && tile !== null && board.cells[line[i]].tile === tile;
      if (same) continue;
      if (i - start >= 3 && tile !== null) {
        runs.push({ tile, cells: line.slice(start, i) });
      }
      start = i;
    }
  };
  for (let y = 0; y < board.height; y++) {
    const row: number[] = [];
    for (let x = 0; x < board.width; x++) row.push(indexOf(board, x, y));
    scanLine(row);
  }
  for (let x = 0; x < board.width; x++) {
    const col: number[] = [];
    for (let y = 0; y < board.height; y++) col.push(indexOf(board, x, y));
    scanLine(col);
  }
  return runs;
}

/**
 * True if placing `tile` at (x, y) would complete a run of 3 with the
 * already-filled cells to its left or above. Used while dealing the initial
 * board (cells right of / below (x, y) are still empty then).
 */
export function makesRunAt(board: Board, x: number, y: number, tile: TileId): boolean {
  const at = (cx: number, cy: number): TileId | null => board.cells[indexOf(board, cx, cy)].tile;
  const leftRun = x >= 2 && at(x - 1, y) === tile && at(x - 2, y) === tile;
  const upRun = y >= 2 && at(x, y - 1) === tile && at(x, y - 2) === tile;
  return leftRun || upRun;
}

/**
 * True if at least one adjacent swap would create a run — i.e. the player
 * still has a legal move. Temporarily mutates the board and restores it
 * before returning.
 */
export function hasAnyValidSwap(board: Board): boolean {
  const swapCreatesRun = (a: number, b: number): boolean => {
    swapCells(board, a, b);
    const found = findRuns(board).length > 0;
    swapCells(board, a, b);
    return found;
  };
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const i = indexOf(board, x, y);
      if (x + 1 < board.width && swapCreatesRun(i, i + 1)) return true;
      if (y + 1 < board.height && swapCreatesRun(i, i + board.width)) return true;
    }
  }
  return false;
}
