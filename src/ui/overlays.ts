/**
 * Non-state overlays the ui adds directly (outside the state-driven render):
 * a first-run "how to play" card and a transient toast for rejected moves.
 */

import { howToPlay } from './instructions';
import type { GameTheme } from '../theme/theme';

/** Show a short message near the bottom that fades itself out. Replaces any current toast. */
export function showToast(root: HTMLElement, message: string): void {
  root.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  root.append(toast);
  setTimeout(() => toast.remove(), 1600);
}

/** Show the "how to play" card. Dismissed by the button or by tapping the backdrop. */
export function showIntro(root: HTMLElement, theme: GameTheme): void {
  root.querySelector('.intro-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'overlay intro-overlay';

  const card = document.createElement('div');
  card.className = 'overlay-card';

  const title = document.createElement('h2');
  title.className = 'overlay-title';
  title.textContent = 'How to play';

  const body = document.createElement('p');
  body.className = 'overlay-body';
  body.textContent = howToPlay(theme);

  const button = document.createElement('button');
  button.className = 'restart';
  button.textContent = "Let's play!";

  const close = () => overlay.remove();
  button.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  card.append(title, body, button);
  overlay.append(card);
  root.append(overlay);
}
