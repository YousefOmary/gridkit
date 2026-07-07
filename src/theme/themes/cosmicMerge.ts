import type { GameTheme } from '../theme';

/**
 * Merge example: fuse matching space stuff up the ladder (tiles[] order =
 * tier order) and forge a galaxy within 80 merges. High tiers spawn never
 * (weight 0) — they can only be built.
 */
export const cosmicMerge: GameTheme = {
  name: 'Cosmic Merge',
  modeId: 'merge',
  gridWidth: 5,
  gridHeight: 5,
  moveLimit: 80,
  goal: { type: 'reach-tile', tileId: 'galaxy', target: 1 },
  tiles: [
    { id: 'dust', emoji: '✨', value: 2, weight: 6 },
    { id: 'rock', emoji: '🪨', value: 4, weight: 3 },
    { id: 'moon', emoji: '🌙', value: 8, weight: 1 },
    { id: 'planet', emoji: '🪐', value: 16, weight: 0 },
    { id: 'star', emoji: '⭐', value: 32, weight: 0 },
    { id: 'galaxy', emoji: '🌌', value: 64, weight: 0 },
  ],
  palette: {
    background: '#0f172a',
    board: '#1e293b',
    cell: '#334155',
    cellSelected: '#475569',
    cellLocked: '#1e293b',
    cardBack: '#1e293b',
    text: '#e2e8f0',
    accent: '#a78bfa',
  },
  text: {
    tagline: 'Fuse matching cosmos. Forge a galaxy.',
    scoreLabel: 'Mass',
    movesLabel: 'Fusions',
    goalLabel: 'Galaxy',
    winTitle: 'A galaxy is born 🌌',
    winBody: 'From dust to galaxy — the universe salutes you.',
    loseTitle: 'Heat death 🥶',
    loseBody: 'The cosmos ran cold before the galaxy formed.',
    playAgain: 'Big bang again',
    cardBackGlyph: '✨',
  },
};
