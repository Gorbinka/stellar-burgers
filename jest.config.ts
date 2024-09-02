import type {Config} from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),

   preset: 'ts-jest',

   transform: {
    // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
    // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest
      },
    ],
  },
 

};

export default config;
