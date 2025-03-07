import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['./src/**/*.{test,spec}.ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Utilise ts-jest pour les fichiers TS et TSX
        '^.+\\.(js|jsx)$': 'babel-jest', // Utilise babel-jest pour les fichiers JS et JSX
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios|react-apexcharts)/', // Ne pas ignorer axios et react-apexcharts
    ],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    coverageDirectory: './src/coverage',
    verbose: true,
}

export default config
