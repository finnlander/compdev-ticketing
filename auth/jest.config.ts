import type { Config } from '@jest/types';

/**
 * Jest configurations
 */
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setEnvVars.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
};

export default config;
