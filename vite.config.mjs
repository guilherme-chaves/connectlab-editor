/// <reference types="vitest" />
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
  test: {
    setupFiles: ['./vitest.setup.mjs'],
    environment: 'happy-dom',
    deps: {
      optimizer: {
        client: {
          inline: ['vitest-canvas-mock'],
        },
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,mjs,ts}'],
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
    tsconfigPaths: true,
  },
  plugins: [],
});
