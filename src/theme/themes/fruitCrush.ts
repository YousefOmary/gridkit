import type { GameTheme } from '../theme';

/**
 * Match-3 example: swap fruit to line up 3+, collect 25 strawberries in
 * 20 moves.
 */
export const fruitCrush: GameTheme = {
  name: 'Fruit Crush',
  modeId: 'match3',
  gridWidth: 8,
  gridHeight: 8,
  moveLimit: 20,
  goal: { type: 'collect', tileId: 'strawberry', target: 25 },
  tiles: [
    { id: 'strawberry', emoji: '🍓', value: 20, weight: 1 },
    { id: 'lemon', emoji: '🍋', value: 10, weight: 1 },
    { id: 'grapes', emoji: '🍇', value: 10, weight: 1 },
    { id: 'blueberry', emoji: '🫐', value: 10, weight: 1 },
    { id: 'kiwi', emoji: '🥝', value: 10, weight: 1 },
  ],
  palette: {
    background: '#fff7ed',
    board: '#fed7aa',
    cell: '#ffffff',
    cellSelected: '#ffedd5',
    cellLocked: '#e7e5e4',
    cardBack: '#fdba74',
    text: '#431407',
    accent: '#ea580c',
  },
  text: {
    tagline: 'Swap fruit. Clear rows. Fill the basket!',
    scoreLabel: 'Score',
    movesLabel: 'Moves',
    goalLabel: 'Strawberries',
    winTitle: 'Basket full! 🧺',
    winBody: 'You collected every strawberry. Sweet!',
    loseTitle: 'Out of moves 🍂',
    loseBody: 'The basket stayed half empty. Another round?',
    playAgain: 'Play again',
    cardBackGlyph: '🍓',
  },
};
