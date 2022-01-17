import type { Config } from '@jest/types';

/**
 * Jest configurations
 */
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
};

export default config;
