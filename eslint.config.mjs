import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      '@stylistic': stylistic,
      js,
    },
    extends: ['js/recommended'],
    rules: {
      '@stylistic/semi': 'error',
      '@stylistic/eol-last': 'error',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/quotes': ['warn', 'single', {'avoidEscape': true}],
      'indent': ['error', 2],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/brace-style': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': ['error', { 'code': 80 }],
      '@stylistic/no-confusing-arrow': 'error',
      '@stylistic/no-extra-parens': [
        'error',
        'all',
        {
          'nestedBinaryExpressions': false
        }
      ],
      '@stylistic/no-mixed-operators': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-multi-spaces': 'error',
      'no-restricted-properties': [
        'error',
        {
          'object': 'describe',
          'property': 'only'
        },
        {
          'object': 'it',
          'property': 'only'
        }
      ]
    },
    ignores: ['build/']
  }
]);
