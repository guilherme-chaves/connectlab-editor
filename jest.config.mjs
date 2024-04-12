/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line node/no-unpublished-import
import {pathsToModuleNameMapper} from 'ts-jest';
import tsconfig from './tsconfig.test.json' with {type: 'json'};
const jestConfig = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  transform: {
    '^.+[.]tsx?$': ['ts-jest', {tsconfig: 'tsconfig.test.json'}],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': "<rootDir>/mocks/imageMock.cjs"
  },
  moduleFileExtensions: ["ts", "js", "mjs", "cjs", "json"],
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {prefix: '<rootDir>/'}),
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: [],
  testEnvironment: 'jsdom',
  verbose: true,
};

export default jestConfig;
