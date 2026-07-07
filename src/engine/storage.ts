/**
 * Save/load contract. The engine only knows this interface; the concrete
 * localStorage / Capacitor Preferences implementations live in platform/.
 */

import type { GameState } from './types';

/** Platform-agnostic async key/value storage. */
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/** Serialize a GameState to a JSON string. */
export function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

/**
 * Parse a previously serialized GameState. Returns null (never throws) when
 * `json` is null, malformed, or not shaped like a GameState.
 */
export function deserializeState(json: string | null): GameState | null {
  if (!json) return null;
  try {
    const state = JSON.parse(json) as GameState;
    const shaped =
      !!state &&
      typeof state === 'object' &&
      !!state.board &&
      Array.isArray(state.board.cells) &&
      typeof state.score === 'number' &&
      typeof state.rngState === 'number' &&
      typeof state.status === 'string';
    return shaped ? state : null;
  } catch {
    return null;
  }
}

/** Persist `state` under `key`. Rejects if the adapter fails. */
export async function saveState(
  adapter: StorageAdapter,
  key: string,
  state: GameState,
): Promise<void> {
  await adapter.set(key, serializeState(state));
}

/** Load the state saved under `key`, or null if absent/corrupt. */
export async function loadState(
  adapter: StorageAdapter,
  key: string,
): Promise<GameState | null> {
  return deserializeState(await adapter.get(key));
}
