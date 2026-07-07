/** iOS/Android implementation of the engine's StorageAdapter, backed by
 * Capacitor Preferences (UserDefaults / SharedPreferences under the hood). */

import { Preferences } from '@capacitor/preferences';
import type { StorageAdapter } from '../engine/storage';

export const nativeStorageAdapter: StorageAdapter = {
  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  },
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },
};
