import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.mjs'],
    plugins: {
      '@stylistic': stylistic,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      stylistic.configs.recommended,
    ],
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/eol-last': 'error',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/brace-style': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': ['error', {
        code: 80,
        comments: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      '@stylistic/no-confusing-arrow': 'error',
      '@stylistic/no-extra-parens': [
        'error',
        'all',
        {
          nestedBinaryExpressions: false,
        },
      ],
      '@stylistic/no-mixed-operators': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/type-generic-spacing': ['error'],
      '@stylistic/type-named-tuple-spacing': ['error'],
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
    ignores: ['build/', 'node_modules/', 'dist/', '*.json'],
  },
]);
