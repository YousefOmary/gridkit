/**
 * The Engine orchestrates one game: it holds the state, validates input
 * against the active GameMode, runs the move pipeline, emits events, and
 * auto-saves after every move. Pure logic — it never touches the DOM; the
 * ui layer subscribes via on() and dispatches input via press/swap/tap.
 */

import { Emitter, type EventType, type Listener } from './events';
import type { GameMode, ModeContext } from './gameMode';
import { areAdjacent, cloneState, createBoard } from './grid';
import { createRng } from './rng';
import { saveState, type StorageAdapter } from './storage';
import type { GameConfig, GameEvent, GameState, Move } from './types';

/** Safety cap on refill/resolve iterations per move (runaway-cascade guard). */
const MAX_CASCADES = 100;

export interface EngineOptions {
  /** Where to auto-save. Omit to disable persistence (e.g. in unit tests). */
  storage?: StorageAdapter;
  /** Save slot key. Default 'gridkit-save'. */
  saveKey?: string;
  /** Resume from a previously saved state instead of starting fresh. */
  initial?: GameState;
  /** Seed for the first game when no `initial` is given. Default Date.now(). */
  seed?: number;
}

export class Engine {
  private state: GameState;
  private emitter = new Emitter();

  constructor(
    private config: GameConfig,
    private mode: GameMode,
    private opts: EngineOptions = {},
  ) {
    this.state = opts.initial ?? this.freshState(opts.seed ?? Date.now());
  }

  /** Subscribe to a GameEvent type ('*' for all). Returns an unsubscribe fn. */
  on(type: EventType, fn: Listener): () => void {
    return this.emitter.on(type, fn);
  }

  /** Current state. Treat as read-only — change it only through moves. */
  getState(): Readonly<GameState> {
    return this.state;
  }

  /** Discard progress and start a new game from `seed` (reproducible). */
  newGame(seed: number = Date.now()): void {
    this.state = this.freshState(seed);
    this.emitter.emit({ type: 'changed', state: this.state });
    this.autoSave();
  }

  /**
   * Route a pointer press on a cell — the only input call the ui needs.
   * 'tap' modes tap the cell; 'swap' modes select on the first press, then
   * swap (adjacent), deselect (same cell), or re-select (anything else).
   */
  press(cell: number): void {
    if (this.mode.inputKind === 'tap') this.tap(cell);
    else this.selectTile(cell);
  }

  /** Select a tile for a swap; pressing an adjacent tile next completes it. */
  selectTile(cell: number): void {
    const prev = this.state.selected;
    if (prev !== null && prev !== cell && areAdjacent(this.state.board, prev, cell)) {
      this.state.selected = null;
      this.swap(prev, cell);
      return;
    }
    this.state.selected = prev === cell ? null : cell;
    this.emitter.emit({ type: 'selected', cell: this.state.selected });
    this.emitter.emit({ type: 'changed', state: this.state });
  }

  /** Attempt to swap two cells. The mode validates; illegal swaps emit 'invalid'. */
  swap(a: number, b: number): void {
    this.runMove({ kind: 'swap', a, b });
  }

  /** Attempt to tap a cell. The mode validates; illegal taps emit 'invalid'. */
  tap(cell: number): void {
    this.runMove({ kind: 'tap', cell });
  }

  private freshState(seed: number): GameState {
    const state: GameState = {
      board: createBoard(this.config.gridWidth, this.config.gridHeight),
      score: 0,
      movesUsed: 0,
      moveLimit: this.config.moveLimit,
      goalProgress: 0,
      status: 'playing',
      seed,
      rngState: seed >>> 0 || 1,
      selected: null,
    };
    const rng = createRng(state.rngState);
    this.mode.init(state, { config: this.config, rng });
    state.rngState = rng.getState();
    return state;
  }

  /** The move pipeline: validate → apply → refill/resolve loop → win/lose → commit. */
  private runMove(move: Move): void {
    if (this.state.status !== 'playing') return;
    const probeCtx: ModeContext = { config: this.config, rng: createRng(this.state.rngState) };
    if (!this.mode.isValidMove(this.state, move, probeCtx)) {
      this.emitter.emit({ type: 'invalid', move });
      return;
    }
    const next = cloneState(this.state);
    const ctx: ModeContext = { config: this.config, rng: createRng(next.rngState) };
    if (this.mode.consumesMove(next, move, ctx)) next.movesUsed += 1;
    const events: GameEvent[] = [{ type: 'moved', move }];
    events.push(...this.mode.applyMove(next, move, ctx));
    for (let i = 0; i < MAX_CASCADES; i++) {
      const refilled = this.mode.refill(next, ctx);
      events.push(...refilled.events);
      const resolved = this.mode.resolve(next, ctx);
      events.push(...resolved.events);
      if (!refilled.changed && !resolved.changed) break;
    }
    next.rngState = ctx.rng.getState();
    if (this.mode.checkWin(next, ctx)) next.status = 'won';
    else if (this.mode.checkLose(next, ctx)) next.status = 'lost';
    this.state = next;
    for (const event of events) this.emitter.emit(event);
    if (next.status !== 'playing') this.emitter.emit({ type: 'status', status: next.status });
    this.emitter.emit({ type: 'changed', state: this.state });
    this.autoSave();
  }

  private autoSave(): void {
    if (!this.opts.storage) return;
    void saveState(this.opts.storage, this.opts.saveKey ?? 'gridkit-save', this.state).catch(
      () => undefined,
    );
  }
}
