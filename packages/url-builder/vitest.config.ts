import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      enabled: false,
      clean: true,
      thresholds: {
        perFile: true,
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      cleanOnRerun: true,
      reportOnFailure: true,
      reporter: ["text", "html"],
      include: ["src/**/*"],
      exclude: [
        "node_nodules/",
        "vitest.setup.ts",
        "src/entry.ts",
        "src/index.ts",
        "src/store.ts",
        "src/types",
        "src/utils/hoc/with-providers.tsx",
        "src/views/**/index.ts",
        "src/contexts/toast.context.tsx",
        "src/hooks/index.ts",
        "src/utils/constants/index.ts",
      ],
    },
    exclude: [...configDefaults.exclude],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
});
