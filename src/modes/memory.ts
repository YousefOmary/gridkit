/**
 * Memory-match: every tile starts face-down. Tap to flip. Flipping two
 * identical tiles locks the pair; a mismatched pair stays visible until the
 * next tap flips it back down. Each completed pair-attempt (second flip)
 * consumes one move. The grid must have an even number of cells.
 * Input: tap. Goal supported: 'match-all-pairs' (target = number of pairs).
 */

import type { GameMode } from '../engine/gameMode';
import type { GameEvent, GameState, TileId } from '../engine/types';
import { noStep, tileValue } from './helpers';

/** Indices of face-up cells not yet locked — the pair attempt in progress. */
function openCells(state: GameState): number[] {
  const open: number[] = [];
  state.board.cells.forEach((cell, i) => {
    if (cell.faceUp && !cell.locked && cell.tile !== null) open.push(i);
  });
  return open;
}

export const memory: GameMode = {
  id: 'memory',
  inputKind: 'tap',

  // Deal cells/2 pairs (cycling the theme's tiles if it lists fewer kinds),
  // shuffled with the seeded RNG so layouts are reproducible, all face-down.
  init(state, ctx) {
    const cells = state.board.cells;
    if (cells.length % 2 !== 0) {
      throw new Error('memory mode needs an even cell count (gridWidth * gridHeight)');
    }
    const pool: TileId[] = [];
    for (let pair = 0; pair < cells.length / 2; pair++) {
      const def = ctx.config.tiles[pair % ctx.config.tiles.length];
      pool.push(def.id, def.id);
    }
    for (let i = pool.length - 1; i > 0; i--) {
      const j = ctx.rng.nextInt(i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    cells.forEach((cell, i) => {
      cell.tile = pool[i];
      cell.faceUp = false;
    });
  },

  // Only face-down, unmatched cells can be tapped.
  isValidMove(state, move) {
    if (move.kind !== 'tap') return false;
    const cell = state.board.cells[move.cell];
    return !!cell && cell.tile !== null && !cell.faceUp && !cell.locked;
  },

  // The tap that completes a pair attempt (second card) costs the move.
  consumesMove(state) {
    return openCells(state).length === 1;
  },

  applyMove(state, move, ctx) {
    if (move.kind !== 'tap') return [];
    const events: GameEvent[] = [];
    const leftover = openCells(state);
    if (leftover.length === 2) {
      // Previous attempt was a mismatch left on display — hide it now.
      for (const i of leftover) state.board.cells[i].faceUp = false;
    }
    state.board.cells[move.cell].faceUp = true;
    const open = openCells(state);
    if (open.length === 2) {
      const [a, b] = open;
      const first = state.board.cells[a];
      const second = state.board.cells[b];
      if (first.tile !== null && first.tile === second.tile) {
        first.locked = true;
        second.locked = true;
        state.goalProgress += 1;
        state.score += tileValue(ctx.config.tiles, first.tile);
        events.push({ type: 'matched', cells: [a, b], tile: first.tile });
      }
    }
    return events;
  },

  refill() {
    return noStep();
  },

  resolve() {
    return noStep();
  },

  checkWin(state, ctx) {
    return state.goalProgress >= ctx.config.goal.target;
  },

  checkLose(state) {
    return state.movesUsed >= state.moveLimit;
  },
};
