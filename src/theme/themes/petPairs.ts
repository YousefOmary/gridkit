import type { GameTheme } from '../theme';

/**
 * Memory-match example: 4×4 = 8 face-down pairs of pets; find them all
 * within 14 pair-attempts. Grid must have an even cell count.
 */
export const petPairs: GameTheme = {
  name: 'Pet Pairs',
  modeId: 'memory',
  gridWidth: 4,
  gridHeight: 4,
  moveLimit: 14,
  goal: { type: 'match-all-pairs', target: 8 },
  tiles: [
    { id: 'dog', emoji: '🐶', value: 50 },
    { id: 'cat', emoji: '🐱', value: 50 },
    { id: 'rabbit', emoji: '🐰', value: 50 },
    { id: 'fox', emoji: '🦊', value: 50 },
    { id: 'panda', emoji: '🐼', value: 50 },
    { id: 'frog', emoji: '🐸', value: 50 },
    { id: 'hamster', emoji: '🐹', value: 50 },
    { id: 'parrot', emoji: '🦜', value: 50 },
  ],
  palette: {
    background: '#f0fdf4',
    board: '#bbf7d0',
    cell: '#ffffff',
    cellSelected: '#dcfce7',
    cellLocked: '#dcfce7',
    cardBack: '#4ade80',
    text: '#14532d',
    accent: '#16a34a',
  },
  text: {
    tagline: 'Flip two cards. Find every furry friend.',
    scoreLabel: 'Treats',
    movesLabel: 'Tries',
    goalLabel: 'Pairs',
    winTitle: 'All pets found! 🎉',
    winBody: 'Every pair reunited. They are very happy about it.',
    loseTitle: 'Nap time 💤',
    loseBody: 'The pets got tired of waiting. One more try?',
    playAgain: 'Shuffle again',
    cardBackGlyph: '🐾',
  },
};
