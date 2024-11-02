/// <reference types="vitest" />
/* eslint-disable node/no-unpublished-import */
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.mjs'],
    environment: 'happy-dom',
    deps: {
      optimizer: {
        web: {
          inline: ['vitest-canvas-mock'],
        },
      },
    },
    coverage: {
      include: ['./test/**/*.test.ts'],
    },
  },
  plugins: [tsconfigPaths()],
});
