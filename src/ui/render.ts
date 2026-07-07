/**
 * The render layer: pure state → DOM, rebuilt from scratch on every change.
 * No game logic lives here. Cells carry data-cell="<index>" and the restart
 * button carries data-restart, so ui/app.ts can drive everything with one
 * delegated click listener.
 */

import { formatNumber } from '../engine/format';
import type { GameState } from '../engine/types';
import type { GameTheme } from '../theme/theme';

/** Render the whole game (header, HUD, grid, end-of-game overlay) into `root`. */
export function render(root: HTMLElement, state: Readonly<GameState>, theme: GameTheme): void {
  const emojiOf = new Map(theme.tiles.map((tile) => [tile.id, tile.emoji]));
  root.innerHTML = '';
  root.append(renderHeader(theme), renderHud(state, theme), renderGrid(state, theme, emojiOf));
  if (state.status !== 'playing') root.append(renderOverlay(state, theme));
}

/** Copy the theme palette into CSS custom properties (see ui/style.css). */
export function applyPalette(theme: GameTheme): void {
  const style = document.documentElement.style;
  style.setProperty('--bg', theme.palette.background);
  style.setProperty('--board', theme.palette.board);
  style.setProperty('--cell', theme.palette.cell);
  style.setProperty('--cell-selected', theme.palette.cellSelected);
  style.setProperty('--cell-locked', theme.palette.cellLocked);
  style.setProperty('--card-back', theme.palette.cardBack);
  style.setProperty('--text', theme.palette.text);
  style.setProperty('--accent', theme.palette.accent);
}

function renderHeader(theme: GameTheme): HTMLElement {
  const header = el('header', 'header');
  header.append(el('h1', 'title', theme.name), el('p', 'tagline', theme.text.tagline));
  return header;
}

function renderHud(state: Readonly<GameState>, theme: GameTheme): HTMLElement {
  const hud = el('div', 'hud');
  hud.append(
    stat(theme.text.scoreLabel, formatNumber(state.score)),
    stat(theme.text.movesLabel, String(Math.max(0, state.moveLimit - state.movesUsed))),
    stat(theme.text.goalLabel, goalText(state, theme)),
  );
  return hud;
}

function goalText(state: Readonly<GameState>, theme: GameTheme): string {
  if (theme.goal.type === 'score') {
    return `${formatNumber(state.score)} / ${formatNumber(theme.goal.target)}`;
  }
  const emoji = theme.tiles.find((tile) => tile.id === theme.goal.tileId)?.emoji ?? '';
  return `${emoji} ${state.goalProgress} / ${theme.goal.target}`.trim();
}

function renderGrid(
  state: Readonly<GameState>,
  theme: GameTheme,
  emojiOf: Map<string, string>,
): HTMLElement {
  const grid = el('div', 'grid');
  grid.style.setProperty('--cols', String(state.board.width));
  grid.style.gridTemplateColumns = `repeat(${state.board.width}, 1fr)`;
  state.board.cells.forEach((cell, i) => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.dataset.cell = String(i);
    if (i === state.selected) button.classList.add('selected');
    if (cell.locked) button.classList.add('locked');
    if (cell.tile !== null && !cell.faceUp) {
      button.classList.add('face-down');
      button.textContent = theme.text.cardBackGlyph;
    } else {
      button.textContent = cell.tile !== null ? (emojiOf.get(cell.tile) ?? '') : '';
    }
    grid.append(button);
  });
  return grid;
}

function renderOverlay(state: Readonly<GameState>, theme: GameTheme): HTMLElement {
  const overlay = el('div', 'overlay');
  const card = el('div', 'overlay-card');
  const won = state.status === 'won';
  card.append(
    el('h2', 'overlay-title', won ? theme.text.winTitle : theme.text.loseTitle),
    el('p', 'overlay-body', won ? theme.text.winBody : theme.text.loseBody),
  );
  const button = document.createElement('button');
  button.className = 'restart';
  button.dataset.restart = 'true';
  button.textContent = theme.text.playAgain;
  card.append(button);
  overlay.append(card);
  return overlay;
}

function stat(label: string, value: string): HTMLElement {
  const box = el('div', 'stat');
  box.append(el('div', 'stat-label', label), el('div', 'stat-value', value));
  return box;
}

function el(tag: string, className: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
