# GridKit — Reskin Guide

One codebase, many games. A **theme file** is a game's entire identity: name,
emoji tiles, colors, goal, grid size, all text, and which rule set it uses.
Making a new game = writing one new theme file. No other code changes.

You can hand this whole document to an LLM ("read THEME.md, then make me a
game about X") — every step below is exact.

## Layers (don't mix them)

| Folder | What it is | Touch it when… |
|---|---|---|
| `src/engine/` | Pure game state machine, no browser code | never (for reskins) |
| `src/modes/` | Rule sets: `match3`, `merge`, `memory`, `tap-collect` | adding a brand-new rule set |
| `src/theme/` | Config objects — a game's identity | **every reskin** |
| `src/ui/` | State → DOM rendering + input | changing the look beyond colors |
| `src/platform/` | Storage adapters (web localStorage / native Preferences) | never |

## Run it

```bash
npm install
npm run dev        # open the printed URL
```

Try all four shipped games without editing anything, via URL:
`?theme=fruit-crush` `?theme=cosmic-merge` `?theme=pet-pairs` `?theme=bug-hunt`

## Make a new reskin (the whole job)

1. Copy the theme file whose **mode** you want:
   - match-3 → `src/theme/themes/fruitCrush.ts`
   - merge/2048 → `src/theme/themes/cosmicMerge.ts`
   - memory pairs → `src/theme/themes/petPairs.ts`
   - tap-to-collect → `src/theme/themes/bugHunt.ts`
   Save the copy as e.g. `src/theme/themes/oceanCrush.ts`.
2. In the copy: rename the exported const (e.g. `export const oceanCrush`)
   and change any fields you like — name, emoji, colors, text, goal, grid
   size, moveLimit. **Keep the `modeId` and `goal.type` a valid combination**
   (table below).
3. Register it in `src/theme/index.ts`:
   ```ts
   import { oceanCrush } from './themes/oceanCrush';
   // add to the record:
   'ocean-crush': oceanCrush,
   // ship the build as this game:
   export const activeTheme: GameTheme = oceanCrush;
   ```
4. `npm run dev` — done. `npm run typecheck` tells you about any typo.

### GameTheme fields (see `src/theme/theme.ts` for the contract)

| Field | Meaning |
|---|---|
| `name` | Title on screen, browser/app title, and the save-slot key |
| `modeId` | Rule set: `match3`, `merge`, `memory`, `tap-collect` |
| `gridWidth` / `gridHeight` | Board size in cells |
| `tiles[]` | `{ id, emoji, value, weight }` — see "Tiles" below |
| `goal` | `{ type, target, tileId? }` — see table below |
| `moveLimit` | Moves before the game is lost |
| `palette` | 8 CSS colors (any CSS color string) |
| `text` | Every player-facing string, incl. win/lose screens |

### Which goal types work with which mode

| `modeId` | Input feel | Valid `goal.type` | Grid rules |
|---|---|---|---|
| `match3` | press one tile, then an adjacent one to swap | `collect` (needs `tileId`), `score` | ≥ 3×3; 5–6 tile kinds plays best |
| `merge` | press two adjacent **identical** tiles to fuse them | `reach-tile` (needs `tileId`), `score` | `tiles[]` order = merge ladder, lowest first; give top tiers `weight: 0` |
| `memory` | tap cards to flip | `match-all-pairs` (`target` = pair count = cells/2) | cell count must be even |
| `tap-collect` | tap any tile to clear it | `collect` (needs `tileId`), `score` | give the target tile a higher `value` |

## Tiles

Each tile: `{ id: 'slug', emoji: '🐙', value: 10, weight: 1 }`

- `id` — any unique slug; `goal.tileId` refers to it.
- `emoji` — the visual. That's the entire art pipeline.
- `value` — points when matched/merged/collected.
- `weight` — spawn frequency (relative; `0` = never spawns, only built).

**Adding a tile** = adding one object to `tiles[]`:
- `match3` / `tap-collect`: more kinds → harder to match / rarer target.
- `merge`: insert at the right **position** — array order is the tier ladder.
- `memory`: kinds are dealt in order and cycled to fill cells/2 pairs; give it
  at least cells/2 kinds if you want no duplicate pairs.

## Adding a new GameMode (developer/LLM task)

1. Create `src/modes/myMode.ts` exporting a `GameMode` (contract:
   `src/engine/gameMode.ts` — every hook is documented there). Skeleton:
   ```ts
   import type { GameMode } from '../engine/gameMode';
   import { noStep } from './helpers';

   export const myMode: GameMode = {
     id: 'my-mode',
     inputKind: 'tap',                    // or 'swap'
     init(state, ctx) { /* fill state.board using ctx.rng */ },
     isValidMove(state, move) { return true; },
     consumesMove() { return true; },
     applyMove(state, move, ctx) { return []; },
     refill: () => noStep(),              // or gravityRefill / spawnRefill
     resolve: () => noStep(),             // cascades go here
     checkWin(state, ctx) { return state.goalProgress >= ctx.config.goal.target; },
     checkLose(state) { return state.movesUsed >= state.moveLimit; },
   };
   ```
2. Register it in `src/modes/index.ts` (add to the `modes` record).
3. Point a theme's `modeId` at `'my-mode'`.

Rules: only mutate the `state` you're handed, draw all randomness from
`ctx.rng` (determinism), never import from `ui/` or touch the DOM.

## Build & ship

```bash
# Web
npm run build            # typecheck + bundle → dist/  (deploy dist/ anywhere static)
npm run preview          # serve the production build locally

# Native shells (one-time setup)
npx cap add android
npx cap add ios          # macOS + Xcode required

# Every release
npm run sync             # build web assets + copy into both native projects
npx cap open android     # opens Android Studio → run / build AAB for Play Store
npx cap open ios         # opens Xcode → run / archive for App Store
```

Shipping a reskin as its own store app: set `activeTheme` (step 3 above) and
change `appId` + `appName` in `capacitor.config.ts` before `npm run sync`.
