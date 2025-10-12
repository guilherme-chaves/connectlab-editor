/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
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
      '@connectlab-editor/editor': path.resolve(
        './src/editor.ts',
      ),
      '@connectlab-editor/environment': path.resolve(
        './src/editorEnvironment.ts',
      ),
      '@connectlab-editor/assets': path.resolve('./src/assets'),
      '@connectlab-editor/gates': path.resolve(
        './src/assets/gates',
      ),
      '@connectlab-editor/types': path.resolve('./src/types'),
      '@connectlab-editor/collisionShapes': path.resolve(
        './src/collision',
      ),
      '@connectlab-editor/components': path.resolve(
        './src/components',
      ),
      '@connectlab-editor/functions/component': path.resolve(
        './src/functions/component',
      ),
      '@connectlab-editor/functions/connection': path.resolve(
        './src/functions/connection',
      ),
      '@connectlab-editor/functions/misc': path.resolve(
        './src/functions/misc',
      ),
      '@connectlab-editor/interfaces': path.resolve(
        './src/interfaces',
      ),
      '@connectlab-editor/models': path.resolve('./src/models'),
      '@connectlab-editor/events': path.resolve('./src/events'),
      '@connectlab-editor/signal': path.resolve(
        './src/functions/signal',
      ),
    },
  },
  plugins: [tsconfigPaths()],
});
