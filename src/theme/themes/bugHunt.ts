import type { GameTheme } from '../theme';

/**
 * Tap-collect example: tap tiles to clear them; catch 12 ladybugs before
 * 25 taps run out. Cleared tiles fall and respawn, so keep hunting.
 */
export const bugHunt: GameTheme = {
  name: 'Bug Hunt',
  modeId: 'tap-collect',
  gridWidth: 6,
  gridHeight: 6,
  moveLimit: 25,
  goal: { type: 'collect', tileId: 'ladybug', target: 12 },
  tiles: [
    { id: 'leaf', emoji: '🍃', value: 5, weight: 5 },
    { id: 'blossom', emoji: '🌸', value: 5, weight: 3 },
    { id: 'mushroom', emoji: '🍄', value: 5, weight: 2 },
    { id: 'ladybug', emoji: '🐞', value: 25, weight: 3 },
  ],
  palette: {
    background: '#f7fee7',
    board: '#d9f99d',
    cell: '#ffffff',
    cellSelected: '#ecfccb',
    cellLocked: '#e5e7eb',
    cardBack: '#a3e635',
    text: '#1a2e05',
    accent: '#65a30d',
  },
  text: {
    tagline: 'Tap through the garden. Catch the ladybugs!',
    scoreLabel: 'Points',
    movesLabel: 'Taps',
    goalLabel: 'Ladybugs',
    winTitle: 'Jar is buzzing! 🫙',
    winBody: 'Twelve ladybugs caught. The garden is impressed.',
    loseTitle: 'They flew away 🌬️',
    loseBody: 'Out of taps — the ladybugs escaped this time.',
    playAgain: 'Hunt again',
    cardBackGlyph: '🐞',
  },
};
