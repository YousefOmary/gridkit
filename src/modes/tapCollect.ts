/**
 * Tap-collect: tap any tile to clear it, costing one move; clearing the goal
 * tile advances progress. Tiles fall and respawn after every tap, so the
 * hunt continues. Win by collecting goal.target of goal.tileId before the
 * moves run out.
 * Input: tap. Goals supported: 'collect', 'score'.
 */

import type { GameMode } from '../engine/gameMode';
import type { TileId } from '../engine/types';
import { gravityRefill, noStep, tileValue, weightedTile } from './helpers';

export const tapCollect: GameMode = {
  id: 'tap-collect',
  inputKind: 'tap',

  init(state, ctx) {
    for (const cell of state.board.cells) {
      cell.tile = weightedTile(ctx.config.tiles, ctx.rng);
    }
  },

  isValidMove(state, move) {
    if (move.kind !== 'tap') return false;
    const cell = state.board.cells[move.cell];
    return !!cell && cell.tile !== null;
  },

  consumesMove() {
    return true;
  },

  applyMove(state, move, ctx) {
    if (move.kind !== 'tap') return [];
    const cell = state.board.cells[move.cell];
    const tile = cell.tile as TileId;
    cell.tile = null;
    state.score += tileValue(ctx.config.tiles, tile);
    const goal = ctx.config.goal;
    if (goal.type === 'collect' && tile === goal.tileId) state.goalProgress += 1;
    if (goal.type === 'score') state.goalProgress = state.score;
    return [{ type: 'matched', cells: [move.cell], tile }];
  },

  refill: gravityRefill,

  resolve() {
    return noStep();
  },

  checkWin(state, ctx) {
    const goal = ctx.config.goal;
    if (goal.type === 'score') return state.score >= goal.target;
    return state.goalProgress >= goal.target;
  },

  checkLose(state) {
    return state.movesUsed >= state.moveLimit;
  },
};
