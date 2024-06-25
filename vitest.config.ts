import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    conditions: ['development', 'browser'],
  },
  test: {
    cache: false,
    coverage: {
      exclude: [],
      include: ['src/**'],
      provider: 'v8',
      thresholds: {
        branches: 85,
        functions: 80,
        lines: 85,
        statements: 85,
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
