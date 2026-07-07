/** Web implementation of the engine's StorageAdapter, backed by localStorage. */

import type { StorageAdapter } from '../engine/storage';

export const localStorageAdapter: StorageAdapter = {
  async get(key: string): Promise<string | null> {
    return window.localStorage.getItem(key);
  },
  async set(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value);
  },
  async remove(key: string): Promise<void> {
    window.localStorage.removeItem(key);
  },
};
