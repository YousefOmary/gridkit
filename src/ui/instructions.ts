/**
 * Per-mode "how to play" copy and invalid-move hints. Keeping these keyed by
 * modeId (not per theme) means every reskin gets correct instructions for
 * free; a theme can still override the intro via theme.text.howTo.
 */

import type { GameTheme } from '../theme/theme';

/** Full intro text shown once, keyed by modeId. */
const HOW_TO: Record<string, string> = {
  match3:
    'Tap a tile, then tap a touching tile to swap them. Line up 3 or more of the same kind in a row or column to clear them. Reach the goal before you run out of moves!',
  merge:
    'Tap a tile, then a touching matching tile to fuse them into the next one up. Keep merging your way to the goal before moves run out!',
  memory:
    'Tap two cards to flip them over. Find every matching pair before you run out of tries!',
  'tap-collect':
    'Tap tiles to clear them and grab your target. Collect enough before your taps run out!',
};

/** Short toast shown when a move is rejected, keyed by modeId. */
const INVALID_HINT: Record<string, string> = {
  match3: 'No match there — line up 3 of a kind.',
  merge: "Those don't merge — pick two of the same.",
  memory: 'Already matched — pick another card.',
  'tap-collect': "You can't clear that one.",
};

/** Intro text for a theme: its custom howTo, else the mode default, else a generic line. */
export function howToPlay(theme: GameTheme): string {
  return theme.text.howTo ?? HOW_TO[theme.modeId] ?? 'Reach the goal before you run out of moves!';
}

/** Short "why nothing happened" hint for a rejected move. */
export function invalidHint(modeId: string): string {
  return INVALID_HINT[modeId] ?? 'That move is not allowed.';
}
