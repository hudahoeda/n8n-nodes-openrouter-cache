import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/nodes'],
	testMatch: ['**/*.test.ts'],
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'!nodes/**/*.test.ts',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'text-summary', 'lcov'],
};

export default config;
