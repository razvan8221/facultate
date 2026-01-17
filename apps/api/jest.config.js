module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@repo/shared$': '<rootDir>/../../packages/shared/src'
    },
};
