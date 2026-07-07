/**
 * Match-3: swap two adjacent tiles to line up 3+ identical tiles. Runs clear,
 * tiles fall, new ones spawn, cascades chain until stable.
 * Input: swap. Goals supported: 'score', 'collect'.
 */

import type { GameMode, StepResult } from '../engine/gameMode';
import { areAdjacent, cloneBoard, indexOf, swapCells } from '../engine/grid';
import type { GameEvent, TileId } from '../engine/types';
import { gravityRefill, noStep, tileValue, weightedTile } from './helpers';
import { findRuns, hasAnyValidSwap, makesRunAt } from './matchFind';

export const match3: GameMode = {
  id: 'match3',
  inputKind: 'swap',

  // Deal every cell a weighted random tile, re-rolling (bounded) any draw
  // that would start the board with a pre-made run.
  init(state, ctx) {
    const { board } = state;
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        let tile = weightedTile(ctx.config.tiles, ctx.rng);
        for (let tries = 0; tries < 30 && makesRunAt(board, x, y, tile); tries++) {
          tile = weightedTile(ctx.config.tiles, ctx.rng);
        }
        board.cells[indexOf(board, x, y)].tile = tile;
      }
    }
  },

  // A swap is legal only between adjacent cells and only if it creates a run.
  // Probes on a board copy so the live state is never touched.
  isValidMove(state, move) {
    if (move.kind !== 'swap') return false;
    if (!areAdjacent(state.board, move.a, move.b)) return false;
    const probe = cloneBoard(state.board);
    swapCells(probe, move.a, move.b);
    return findRuns(probe).length > 0;
  },

  consumesMove() {
    return true;
  },

  applyMove(state, move) {
    if (move.kind !== 'swap') return [];
    swapCells(state.board, move.a, move.b);
    return [];
  },

  refill: gravityRefill,

  // One cascade pass: clear all current runs, credit score and goal progress.
  resolve(state, ctx): StepResult {
    const runs = findRuns(state.board);
    if (runs.length === 0) return noStep();
    const cleared = new Map<number, TileId>();
    for (const run of runs) for (const cell of run.cells) cleared.set(cell, run.tile);
    for (const [cellIndex, tile] of cleared) {
      state.board.cells[cellIndex].tile = null;
      state.score += tileValue(ctx.config.tiles, tile);
      if (ctx.config.goal.type === 'collect' && tile === ctx.config.goal.tileId) {
        state.goalProgress += 1;
      }
    }
    if (ctx.config.goal.type === 'score') state.goalProgress = state.score;
    const events: GameEvent[] = runs.map((run) => ({
      type: 'matched',
      cells: run.cells,
      tile: run.tile,
    }));
    return { changed: true, events };
  },

  checkWin(state, ctx) {
    const goal = ctx.config.goal;
    if (goal.type === 'score') return state.score >= goal.target;
    return state.goalProgress >= goal.target;
  },

  checkLose(state) {
    return state.movesUsed >= state.moveLimit || !hasAnyValidSwap(state.board);
  },
};
