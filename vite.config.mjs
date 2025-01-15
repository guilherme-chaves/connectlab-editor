/// <reference types="vitest" />
/* eslint-disable node/no-unpublished-import */
import path from 'path';
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
  resolve: {
    alias: {
      '@connectlab-editor/editor': path.resolve(__dirname, './src/editor.ts'),
      '@connectlab-editor/environment': path.resolve(
        __dirname,
        './src/editorEnvironment.ts'
      ),
      '@connectlab-editor/assets': path.resolve(__dirname, './src/assets'),
      '@connectlab-editor/gates': path.resolve(__dirname, './src/assets/gates'),
      '@connectlab-editor/types': path.resolve(__dirname, './src/types'),
      '@connectlab-editor/collisionShapes': path.resolve(
        __dirname,
        './src/collision'
      ),
      '@connectlab-editor/components': path.resolve(
        __dirname,
        './src/components'
      ),
      '@connectlab-editor/functions/component': path.resolve(
        __dirname,
        './src/functions/component'
      ),
      '@connectlab-editor/functions/connection': path.resolve(
        __dirname,
        './src/functions/connection'
      ),
      '@connectlab-editor/functions/misc': path.resolve(
        __dirname,
        './src/functions/misc'
      ),
      '@connectlab-editor/interfaces': path.resolve(
        __dirname,
        './src/interfaces'
      ),
      '@connectlab-editor/models': path.resolve(__dirname, './src/models'),
      '@connectlab-editor/events': path.resolve(__dirname, './src/events'),
      '@connectlab-editor/signal': path.resolve(
        __dirname,
        './src/functions/signal'
      ),
    },
  },
  plugins: [tsconfigPaths()],
});
