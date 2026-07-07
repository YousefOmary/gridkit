/** Platform detection: hand the right StorageAdapter to the app at boot. */

import { Capacitor } from '@capacitor/core';
import type { StorageAdapter } from '../engine/storage';
import { localStorageAdapter } from './storageLocal';
import { nativeStorageAdapter } from './storageNative';

/** Capacitor Preferences on iOS/Android, localStorage on the web. */
export function pickStorageAdapter(): StorageAdapter {
  return Capacitor.isNativePlatform() ? nativeStorageAdapter : localStorageAdapter;
}
