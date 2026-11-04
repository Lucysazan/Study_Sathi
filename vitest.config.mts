import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    // Rules tests need the emulator: run them with `npm run test:rules`.
    exclude: ['node_modules', 'legacy', '.next', 'tests/rules/**'],
  },
});
