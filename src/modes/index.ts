/**
 * Mode registry. A theme picks its rules by setting modeId to one of these
 * keys. To add a new mode: implement GameMode in a new file here, then add
 * it to this record (see THEME.md → "Adding a new GameMode").
 */

import type { GameMode } from '../engine/gameMode';
import { match3 } from './match3';
import { memory } from './memory';
import { merge } from './merge';
import { tapCollect } from './tapCollect';

/** All shipped rule modules, keyed by the id themes reference via modeId. */
export const modes: Record<string, GameMode> = {
  [match3.id]: match3,
  [merge.id]: merge,
  [memory.id]: memory,
  [tapCollect.id]: tapCollect,
};

/** Look up a mode by id. Throws a descriptive error for unknown ids. */
export function getMode(id: string): GameMode {
  const mode = modes[id];
  if (!mode) {
    throw new Error(`Unknown modeId "${id}". Available: ${Object.keys(modes).join(', ')}`);
  }
  return mode;
}
