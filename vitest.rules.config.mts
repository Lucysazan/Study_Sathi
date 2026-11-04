import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Firestore rules tests. Run with `npm run test:rules` (starts the Firestore emulator).
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/rules/**/*.test.ts'],
    // Tests share one emulator database, so run files one after another.
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
