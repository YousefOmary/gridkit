import type { GameTheme } from '../theme';

/**
 * Memory-match reskin: 4×4 = 8 face-down pairs of national flags; find them
 * all within 14 pair-attempts. Aimed at geography/travel/quiz communities.
 * Grid must have an even cell count and exactly (cells / 2) tiles.
 */
export const flagFrenzy: GameTheme = {
  name: 'Flag Frenzy',
  modeId: 'memory',
  gridWidth: 4,
  gridHeight: 4,
  moveLimit: 14,
  goal: { type: 'match-all-pairs', target: 8 },
  tiles: [
    { id: 'japan', emoji: '🇯🇵', value: 50 },
    { id: 'brazil', emoji: '🇧🇷', value: 50 },
    { id: 'france', emoji: '🇫🇷', value: 50 },
    { id: 'germany', emoji: '🇩🇪', value: 50 },
    { id: 'italy', emoji: '🇮🇹', value: 50 },
    { id: 'canada', emoji: '🇨🇦', value: 50 },
    { id: 'korea', emoji: '🇰🇷', value: 50 },
    { id: 'mexico', emoji: '🇲🇽', value: 50 },
  ],
  palette: {
    background: '#eff6ff',
    board: '#bfdbfe',
    cell: '#ffffff',
    cellSelected: '#dbeafe',
    cellLocked: '#dbeafe',
    cardBack: '#60a5fa',
    text: '#172554',
    accent: '#2563eb',
  },
  text: {
    tagline: 'Flip two cards. Match every flag.',
    scoreLabel: 'Score',
    movesLabel: 'Tries',
    goalLabel: 'Pairs',
    winTitle: 'World tour complete! 🌍',
    winBody: 'Every flag matched. A true globetrotter.',
    loseTitle: 'Lost in transit ✈️',
    loseBody: 'Ran out of tries before matching them all. Again?',
    playAgain: 'Reshuffle',
    cardBackGlyph: '🌐',
  },
};
