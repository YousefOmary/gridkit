import type { GameTheme } from '../theme';

/**
 * Tap-collect reskin: tap tiles to clear them; catch 12 ghosts before 25
 * taps run out. Cleared tiles fall and respawn. Seasonal Halloween theme —
 * seasonal timing is a strong download driver.
 */
export const spookySnatch: GameTheme = {
  name: 'Spooky Snatch',
  modeId: 'tap-collect',
  gridWidth: 6,
  gridHeight: 6,
  moveLimit: 25,
  goal: { type: 'collect', tileId: 'ghost', target: 12 },
  tiles: [
    { id: 'web', emoji: '🕸️', value: 5, weight: 5 },
    { id: 'pumpkin', emoji: '🎃', value: 5, weight: 3 },
    { id: 'bat', emoji: '🦇', value: 5, weight: 2 },
    { id: 'ghost', emoji: '👻', value: 25, weight: 3 },
  ],
  palette: {
    background: '#1c1917',
    board: '#292524',
    cell: '#44403c',
    cellSelected: '#57534e',
    cellLocked: '#292524',
    cardBack: '#292524',
    text: '#fef3c7',
    accent: '#f97316',
  },
  text: {
    tagline: 'Tap the haunt. Snatch the ghosts!',
    scoreLabel: 'Points',
    movesLabel: 'Taps',
    goalLabel: 'Ghosts',
    winTitle: 'Jar of spooks! 🏺',
    winBody: 'Twelve ghosts caught. The haunt is yours.',
    loseTitle: 'They vanished 💨',
    loseBody: 'Out of taps — the ghosts slipped away. Again?',
    playAgain: 'Haunt again',
    cardBackGlyph: '👻',
  },
};
