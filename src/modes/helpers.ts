/** Spawn/gravity/refill building blocks shared by the rule modules. */

import type { ModeContext, StepResult } from '../engine/gameMode';
import { indexOf } from '../engine/grid';
import type { Rng } from '../engine/rng';
import type { Board, GameState, TileDef, TileId } from '../engine/types';

/** Pick a random tile id, honoring TileDef.weight (default 1, 0 = never). */
export function weightedTile(tiles: TileDef[], rng: Rng): TileId {
  let total = 0;
  for (const tile of tiles) total += tile.weight ?? 1;
  let roll = rng.next() * total;
  for (const tile of tiles) {
    roll -= tile.weight ?? 1;
    if (roll < 0) return tile.id;
  }
  return tiles[tiles.length - 1].id;
}

/** Score value of a tile id (TileDef.value; 10 when a theme omits it). */
export function tileValue(tiles: TileDef[], id: TileId): number {
  return tiles.find((tile) => tile.id === id)?.value ?? 10;
}

/**
 * Let tiles fall straight down into empty cells, column by column, in place.
 * Only for modes where every tile is face-up and unlocked. Returns true if
 * anything moved.
 */
export function applyGravity(board: Board): boolean {
  let moved = false;
  for (let x = 0; x < board.width; x++) {
    let write = board.height - 1;
    for (let y = board.height - 1; y >= 0; y--) {
      const cell = board.cells[indexOf(board, x, y)];
      if (cell.tile === null) continue;
      if (y !== write) {
        board.cells[indexOf(board, x, write)].tile = cell.tile;
        cell.tile = null;
        moved = true;
      }
      write--;
    }
  }
  return moved;
}

/**
 * Refill without gravity: spawn weighted random tiles into every empty cell,
 * in place. Emits one 'spawned' event when anything spawned.
 */
export function spawnRefill(state: GameState, ctx: ModeContext): StepResult {
  const spawned: number[] = [];
  state.board.cells.forEach((cell, i) => {
    if (cell.tile === null) {
      cell.tile = weightedTile(ctx.config.tiles, ctx.rng);
      spawned.push(i);
    }
  });
  return {
    changed: spawned.length > 0,
    events: spawned.length ? [{ type: 'spawned', cells: spawned }] : [],
  };
}

/** Standard falling-tile refill: gravity first, then spawn into the gaps at the top. */
export function gravityRefill(state: GameState, ctx: ModeContext): StepResult {
  const moved = applyGravity(state.board);
  const spawnResult = spawnRefill(state, ctx);
  return { changed: moved || spawnResult.changed, events: spawnResult.events };
}

/** A StepResult meaning "nothing to do" — for modes without cascades or refills. */
export function noStep(): StepResult {
  return { changed: false, events: [] };
}
