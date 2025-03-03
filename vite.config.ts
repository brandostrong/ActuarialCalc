import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { UserConfigExport } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ActuarialCalc/', // Base path for GitHub Pages
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'], // This file doesn't exist yet, I'll create it later
  }
} as UserConfigExport);