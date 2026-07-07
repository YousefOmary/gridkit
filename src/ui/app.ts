/**
 * App bootstrap: choose theme + storage, resume a saved game if one exists,
 * wire input (one delegated click listener), sound + shake feedback, and
 * rendering (re-render on every engine 'changed' event). This is the only
 * place the layers meet.
 */

import { Engine } from '../engine/engine';
import { loadState } from '../engine/storage';
import type { GameState } from '../engine/types';
import { getMode } from '../modes';
import { pickStorageAdapter } from '../platform';
import { activeTheme, themes } from '../theme';
import type { GameTheme } from '../theme/theme';
import { applyPalette, render } from './render';
import { play, toggleMute } from './sound';

/** Resolve this session's theme: `?theme=<key>` dev override, else activeTheme. */
function pickTheme(): GameTheme {
  const key = new URLSearchParams(window.location.search).get('theme');
  return (key !== null && themes[key]) || activeTheme;
}

/** True if a saved state belongs to this theme's board shape (guards against
 * resuming a save made before the theme's grid size was edited). */
function fitsTheme(saved: GameState, theme: GameTheme): boolean {
  return saved.board.width === theme.gridWidth && saved.board.height === theme.gridHeight;
}

/** Briefly shake the board (invalid move) — the grid element survives because
 * an invalid move emits no 'changed', so no re-render clears the class. */
function shakeBoard(root: HTMLElement): void {
  const grid = root.querySelector<HTMLElement>('.grid');
  if (!grid) return;
  grid.classList.remove('shake');
  void grid.offsetWidth; // force reflow so the animation can retrigger
  grid.classList.add('shake');
}

/** Boot the game inside `root`. */
export async function startApp(root: HTMLElement): Promise<void> {
  const theme = pickTheme();
  const mode = getMode(theme.modeId);
  const storage = pickStorageAdapter();
  const saveKey = `gridkit:${theme.name}`;

  document.title = theme.name;
  applyPalette(theme);

  const saved = await loadState(storage, saveKey);
  const resumable = saved !== null && saved.status === 'playing' && fitsTheme(saved, theme);
  const engine = new Engine(theme, mode, {
    storage,
    saveKey,
    initial: resumable ? saved : undefined,
  });

  engine.on('changed', (event) => {
    if (event.type === 'changed') render(root, event.state, theme);
  });

  // Sound + tactile feedback (engine emits these before the final 'changed').
  engine.on('selected', (e) => { if (e.type === 'selected' && e.cell !== null) play('select'); });
  engine.on('matched', () => play('match'));
  engine.on('merged', () => play('merge'));
  engine.on('invalid', () => { play('invalid'); shakeBoard(root); });
  engine.on('status', (e) => { if (e.type === 'status') play(e.status === 'won' ? 'win' : 'lose'); });

  root.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const muteBtn = target.closest<HTMLElement>('[data-mute]');
    if (muteBtn !== null) {
      muteBtn.textContent = toggleMute() ? '🔇' : '🔊';
      return;
    }
    const cell = target.closest<HTMLElement>('[data-cell]');
    if (cell !== null) {
      engine.press(Number(cell.dataset.cell));
      return;
    }
    if (target.closest('[data-restart]') !== null) engine.newGame();
  });

  render(root, engine.getState(), theme);
}
