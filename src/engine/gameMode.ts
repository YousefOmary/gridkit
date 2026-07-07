/**
 * The GameMode contract — the single interface every rule module in modes/
 * implements. The engine owns the move pipeline (validate → apply →
 * refill/resolve loop → win/lose check) and calls these hooks in order.
 *
 * All hooks may mutate `state` in place: the engine hands them a private
 * clone and only commits it once the move fully resolves.
 */

import type { Rng } from './rng';
import type { GameConfig, GameEvent, GameState, Move } from './types';

/** Everything a mode needs besides the state: theme gameplay config + seeded RNG. */
export interface ModeContext {
  config: GameConfig;
  rng: Rng;
}

/** Result of one refill or resolve pass. changed=false means "board is stable". */
export interface StepResult {
  changed: boolean;
  events: GameEvent[];
}

export interface GameMode {
  /** Unique id referenced by GameTheme.modeId (see modes/index.ts registry). */
  id: string;

  /** 'swap': two-press select-then-swap input. 'tap': single-cell taps. */
  inputKind: 'swap' | 'tap';

  /** Populate a fresh, empty board into a valid starting position. */
  init(state: GameState, ctx: ModeContext): void;

  /** True if `move` is legal in `state`. Must not (net) mutate state. */
  isValidMove(state: GameState, move: Move, ctx: ModeContext): boolean;

  /**
   * True if this already-validated move should consume one of the player's
   * limited moves. Called on the pre-move state, before applyMove.
   */
  consumesMove(state: GameState, move: Move, ctx: ModeContext): boolean;

  /** Apply the immediate effect of a validated move. Returns what happened. */
  applyMove(state: GameState, move: Move, ctx: ModeContext): GameEvent[];

  /**
   * Fill holes (gravity and/or spawns). The engine alternates refill and
   * resolve until both report changed=false.
   */
  refill(state: GameState, ctx: ModeContext): StepResult;

  /** One cascade pass: clear matches / chain reactions created since last pass. */
  resolve(state: GameState, ctx: ModeContext): StepResult;

  /** True if the goal is reached. Checked after every move; a win beats a loss. */
  checkWin(state: GameState, ctx: ModeContext): boolean;

  /** True if the game can no longer continue (out of moves / no legal move). */
  checkLose(state: GameState, ctx: ModeContext): boolean;
}
