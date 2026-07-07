import { defineConfig } from 'vite';

// base './' so the built bundle loads from the filesystem inside the
// Capacitor iOS/Android shells as well as from any web path.
export default defineConfig({
  base: './',
  build: { target: 'es2020' },
});
