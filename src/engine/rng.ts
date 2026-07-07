/**
 * Deterministic RNG (mulberry32). The cursor lives in GameState.rngState,
 * so a saved game resumed on any platform draws the exact same sequence.
 */

export interface Rng {
  /** Uniform float in [0, 1). Advances the internal cursor. */
  next(): number;
  /** Uniform integer in [0, maxExclusive). Advances the internal cursor. */
  nextInt(maxExclusive: number): number;
  /** Current cursor, to be written back into GameState.rngState. */
  getState(): number;
}

/**
 * Create an RNG resuming from `state` (any 32-bit integer; a fresh seed
 * works the same way). Identical state always yields the identical sequence.
 */
export function createRng(state: number): Rng {
  let cursor = state >>> 0;
  return {
    next(): number {
      cursor = (cursor + 0x6d2b79f5) >>> 0;
      let t = cursor;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    nextInt(maxExclusive: number): number {
      return Math.floor(this.next() * maxExclusive);
    },
    getState(): number {
      return cursor;
    },
  };
}
