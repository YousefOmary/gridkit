/**
 * Theme registry + the build's active theme.
 * Reskinning a game = pointing `activeTheme` at a different (or new) theme.
 */

import type { GameTheme } from './theme';
import { bugHunt } from './themes/bugHunt';
import { cosmicMerge } from './themes/cosmicMerge';
import { flagFrenzy } from './themes/flagFrenzy';
import { fruitCrush } from './themes/fruitCrush';
import { petPairs } from './themes/petPairs';
import { spookySnatch } from './themes/spookySnatch';
import { sushiRush } from './themes/sushiRush';

/**
 * Every registered theme, keyed by a URL-friendly id. During development any
 * of them can be played via `?theme=<key>` without touching activeTheme.
 */
export const themes: Record<string, GameTheme> = {
  'fruit-crush': fruitCrush,
  'cosmic-merge': cosmicMerge,
  'pet-pairs': petPairs,
  'bug-hunt': bugHunt,
  'sushi-rush': sushiRush,
  'flag-frenzy': flagFrenzy,
  'spooky-snatch': spookySnatch,
};

/** The game this build ships as. Change this one line to reskin the app. */
export const activeTheme: GameTheme = fruitCrush;
