/// <reference types="vitest" />
/* eslint-disable node/no-unpublished-import */
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: './',
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
      provider: 'v8',
      include: ['src/**'],
    },
  },
  plugins: [tsconfigPaths()],
});
