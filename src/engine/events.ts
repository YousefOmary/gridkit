/** Minimal typed pub/sub. The engine emits, the ui subscribes.
 * The engine never imports ui/ — this emitter is the only bridge. */

import type { GameEvent } from './types';

/** An event type to subscribe to, or '*' for every event. */
export type EventType = GameEvent['type'] | '*';

export type Listener = (event: GameEvent) => void;

export class Emitter {
  private listeners = new Map<EventType, Set<Listener>>();

  /**
   * Subscribe `fn` to events of `type` ('*' = all events).
   * Returns an unsubscribe function.
   */
  on(type: EventType, fn: Listener): () => void {
    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    set.add(fn);
    return () => set.delete(fn);
  }

  /** Deliver `event` to its type's listeners, then to '*' listeners. */
  emit(event: GameEvent): void {
    this.listeners.get(event.type)?.forEach((fn) => fn(event));
    this.listeners.get('*')?.forEach((fn) => fn(event));
  }
}
