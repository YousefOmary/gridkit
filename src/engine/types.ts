/**
 * Core engine types. Everything in engine/ is pure data + logic:
 * no DOM, no browser APIs, deterministic, unit-testable.
 */

/** Id of a tile as declared in the active theme's `tiles` array. */
export type TileId = string;

/** Gameplay-relevant tile definition. Themes extend this with an emoji. */
export interface TileDef {
  id: TileId;
  /** Score awarded when this tile is matched/merged/collected. */
  value?: number;
  /** Relative spawn weight for random refills (0 = never spawns). Default 1. */
  weight?: number;
}

/** What the player must achieve to win. */
export interface GoalConfig {
  /**
   * 'score'           — reach `target` points.
   * 'collect'         — clear/collect `target` tiles of `tileId`.
   * 'reach-tile'      — create tile `tileId` `target` times (merge mode).
   * 'match-all-pairs' — match `target` pairs (memory mode).
   */
  type: 'score' | 'collect' | 'reach-tile' | 'match-all-pairs';
  target: number;
  tileId?: TileId;
}

/** The gameplay subset of a theme: everything the engine and modes need to run. */
export interface GameConfig {
  gridWidth: number;
  gridHeight: number;
  tiles: TileDef[];
  goal: GoalConfig;
  moveLimit: number;
}

/**
 * One board cell. `tile` is null when empty. `faceUp`/`locked` exist for
 * modes that hide or freeze tiles (memory-match); all other shipped modes
 * keep faceUp=true and locked=false.
 */
export interface Cell {
  tile: TileId | null;
  faceUp: boolean;
  locked: boolean;
}

/** Rectangular board. Cells are row-major: index = y * width + x. */
export interface Board {
  width: number;
  height: number;
  cells: Cell[];
}

export type GameStatus = 'playing' | 'won' | 'lost';

/** Complete game state. JSON-serializable — this is exactly what gets saved. */
export interface GameState {
  board: Board;
  score: number;
  movesUsed: number;
  moveLimit: number;
  goalProgress: number;
  status: GameStatus;
  /** Seed the game started from, kept for reproducing the whole game. */
  seed: number;
  /** Current RNG cursor; advances on every draw so saved games replay identically. */
  rngState: number;
  /** Cell index selected by the first half of a two-step swap, or null. */
  selected: number | null;
}

/** A player action, already resolved to cell indices by the ui layer. */
export type Move =
  | { kind: 'swap'; a: number; b: number }
  | { kind: 'tap'; cell: number };

/**
 * Events emitted while a move resolves. 'changed' always fires last and
 * carries the committed state — the ui re-renders from it. The granular
 * events (matched/merged/spawned/...) exist for animation and sound hooks.
 */
export type GameEvent =
  | { type: 'moved'; move: Move }
  | { type: 'invalid'; move: Move }
  | { type: 'selected'; cell: number | null }
  | { type: 'matched'; cells: number[]; tile: TileId }
  | { type: 'merged'; from: number; to: number; tile: TileId }
  | { type: 'spawned'; cells: number[] }
  | { type: 'status'; status: GameStatus }
  | { type: 'changed'; state: GameState };
