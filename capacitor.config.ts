import type { CapacitorConfig } from '@capacitor/cli';

// appId/appName identify the native app in the stores.
// Change both when shipping a reskin as its own app (see THEME.md).
const config: CapacitorConfig = {
  appId: 'com.example.gridkit',
  appName: 'GridKit',
  webDir: 'dist',
};

export default config;
