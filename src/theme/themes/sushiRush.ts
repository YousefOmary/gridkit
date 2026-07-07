import type { GameTheme } from '../theme';

/**
 * Match-3 reskin: swap plates to line up 3+, collect 25 sushi in 20 moves.
 * Broad-appeal food theme — easy to share on food/casual-game communities.
 */
export const sushiRush: GameTheme = {
  name: 'Sushi Rush',
  modeId: 'match3',
  gridWidth: 8,
  gridHeight: 8,
  moveLimit: 20,
  goal: { type: 'collect', tileId: 'sushi', target: 25 },
  tiles: [
    { id: 'sushi', emoji: '🍣', value: 20, weight: 1 },
    { id: 'riceball', emoji: '🍙', value: 10, weight: 1 },
    { id: 'shrimp', emoji: '🍤', value: 10, weight: 1 },
    { id: 'naruto', emoji: '🍥', value: 10, weight: 1 },
    { id: 'dumpling', emoji: '🥟', value: 10, weight: 1 },
  ],
  palette: {
    background: '#fef2f2',
    board: '#fecaca',
    cell: '#ffffff',
    cellSelected: '#fee2e2',
    cellLocked: '#e7e5e4',
    cardBack: '#f87171',
    text: '#450a0a',
    accent: '#dc2626',
  },
  text: {
    tagline: 'Swap plates. Line up sushi. Fill the tray!',
    scoreLabel: 'Score',
    movesLabel: 'Moves',
    goalLabel: 'Sushi',
    winTitle: 'Tray complete! 🍱',
    winBody: 'You rolled up every piece. Itadakimasu!',
    loseTitle: 'Kitchen closed 🥢',
    loseBody: 'Ran out of moves before the tray was full. Again?',
    playAgain: 'Play again',
    cardBackGlyph: '🍣',
  },
};
