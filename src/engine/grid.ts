/** Board construction and geometry helpers. Pure functions, no side effects
 * beyond the documented in-place mutations. */

import type { Board, GameState } from './types';

/** Create a width×height board of empty, face-up, unlocked cells. */
export function createBoard(width: number, height: number): Board {
  const cells = Array.from({ length: width * height }, () => ({
    tile: null,
    faceUp: true,
    locked: false,
  }));
  return { width, height, cells };
}

/** Row-major cell index of coordinates (x, y). Does not bounds-check. */
export function indexOf(board: Board, x: number, y: number): number {
  return y * board.width + x;
}

/** True if cell indices a and b are orthogonal neighbors on the board. */
export function areAdjacent(board: Board, a: number, b: number): boolean {
  const ax = a % board.width;
  const ay = Math.floor(a / board.width);
  const bx = b % board.width;
  const by = Math.floor(b / board.width);
  return Math.abs(ax - bx) + Math.abs(ay - by) === 1;
}

/** Swap the full contents of two cells in place (tile, faceUp, locked). */
export function swapCells(board: Board, a: number, b: number): void {
  const tmp = board.cells[a];
  board.cells[a] = board.cells[b];
  board.cells[b] = tmp;
}

/** Deep-copy a board (new cells array, new cell objects). */
export function cloneBoard(board: Board): Board {
  return {
    width: board.width,
    height: board.height,
    cells: board.cells.map((cell) => ({ ...cell })),
  };
}

/** Deep-copy a game state. The engine mutates the copy, then commits it. */
export function cloneState(state: GameState): GameState {
  return { ...state, board: cloneBoard(state.board) };
}
