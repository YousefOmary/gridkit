/**
 * Merge (2048-style): combine two adjacent identical tiles into the next tile
 * of the theme's ladder — tiles[] order IS the tier order, lowest first. The
 * merged tile lands on the second-pressed cell; the freed cell refills with a
 * weighted random spawn (give high tiers weight 0 so they are only ever built).
 * Input: swap. Goals supported: 'reach-tile', 'score'.
 */

import type { GameMode } from '../engine/gameMode';
import { areAdjacent } from '../engine/grid';
import type { Board, TileDef, TileId } from '../engine/types';
import { noStep, spawnRefill, weightedTile } from './helpers';

/** The tile one tier above `id` in the ladder, or null at the top. */
function nextTier(tiles: TileDef[], id: TileId): TileDef | null {
  const index = tiles.findIndex((tile) => tile.id === id);
  if (index < 0 || index + 1 >= tiles.length) return null;
  return tiles[index + 1];
}

/** True if any adjacent identical pair with an upgrade still exists. */
function hasAnyMerge(board: Board, tiles: TileDef[]): boolean {
  for (let i = 0; i < board.cells.length; i++) {
    const tile = board.cells[i].tile;
    if (tile === null || nextTier(tiles, tile) === null) continue;
    const x = i % board.width;
    const right = x + 1 < board.width && board.cells[i + 1].tile === tile;
    const below = i + board.width < board.cells.length && board.cells[i + board.width].tile === tile;
    if (right || below) return true;
  }
  return false;
}

export const merge: GameMode = {
  id: 'merge',
  inputKind: 'swap',

  init(state, ctx) {
    for (const cell of state.board.cells) {
      cell.tile = weightedTile(ctx.config.tiles, ctx.rng);
    }
  },

  isValidMove(state, move, ctx) {
    if (move.kind !== 'swap') return false;
    if (!areAdjacent(state.board, move.a, move.b)) return false;
    const a = state.board.cells[move.a].tile;
    const b = state.board.cells[move.b].tile;
    return a !== null && a === b && nextTier(ctx.config.tiles, a) !== null;
  },

  consumesMove() {
    return true;
  },

  applyMove(state, move, ctx) {
    if (move.kind !== 'swap') return [];
    const current = state.board.cells[move.a].tile as TileId;
    const upgraded = nextTier(ctx.config.tiles, current) as TileDef;
    state.board.cells[move.b].tile = upgraded.id;
    state.board.cells[move.a].tile = null;
    state.score += upgraded.value ?? 10;
    const goal = ctx.config.goal;
    if (goal.type === 'reach-tile' && upgraded.id === goal.tileId) state.goalProgress += 1;
    if (goal.type === 'score') state.goalProgress = state.score;
    return [{ type: 'merged', from: move.a, to: move.b, tile: upgraded.id }];
  },

  refill: spawnRefill,

  resolve() {
    return noStep();
  },

  checkWin(state, ctx) {
    const goal = ctx.config.goal;
    if (goal.type === 'score') return state.score >= goal.target;
    return state.goalProgress >= goal.target;
  },

  checkLose(state, ctx) {
    return state.movesUsed >= state.moveLimit || !hasAnyMerge(state.board, ctx.config.tiles);
  },
};
