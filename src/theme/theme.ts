/**
 * The GameTheme contract. One theme object = one complete game identity:
 * name, rules (via modeId), grid size, tiles, goal, colors, and every
 * player-facing string. Reskinning a game means writing a new object of
 * this shape and nothing else — see THEME.md.
 */

import type { GameConfig, TileDef } from '../engine/types';

/** A tile as themes declare it: gameplay fields plus the emoji drawn on screen. */
export interface ThemeTile extends TileDef {
  emoji: string;
}

/** Every color the UI uses. Any CSS color string works. */
export interface Palette {
  /** Page background. */
  background: string;
  /** Board frame behind the cells. */
  board: string;
  /** Cell background (also cards, stat chips, overlay card). */
  cell: string;
  /** Cell background while selected (swap modes). */
  cellSelected: string;
  /** Cell background once locked/matched (memory mode). */
  cellLocked: string;
  /** Face-down card background (memory mode). */
  cardBack: string;
  /** Main text color. */
  text: string;
  /** Highlights: selection outline, buttons. */
  accent: string;
}

/** Every player-facing string. */
export interface ThemeText {
  tagline: string;
  scoreLabel: string;
  movesLabel: string;
  goalLabel: string;
  winTitle: string;
  winBody: string;
  loseTitle: string;
  loseBody: string;
  playAgain: string;
  /** Glyph shown on face-down cells (memory mode; unused elsewhere). */
  cardBackGlyph: string;
  /** Optional custom "how to play" text. Omit to use the per-mode default
   * (see ui/instructions.ts) — so reskins get correct instructions for free. */
  howTo?: string;
}

/** One complete, self-contained game definition. */
export interface GameTheme extends GameConfig {
  /** Display name — shown as the game title and used as the save-slot key. */
  name: string;
  /** Which rule module runs the game; must exist in modes/index.ts. */
  modeId: string;
  tiles: ThemeTile[];
  palette: Palette;
  text: ThemeText;
}
