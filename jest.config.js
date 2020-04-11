module.exports = {
    setupFilesAfterEnv: ["<rootDir>src/tests/setupTests.js"],
    modulePaths: ["<rootDir>src"],
    coverageDirectory: "<rootDir>results/coverage",
    moduleFileExtensions: ["js", "jsx", "json"],
    moduleDirectories: ["node_modules"],
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "<rootDir>src/**/?(*.)+(spec|test).[jt]s?(x)",
    ],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css)$":
            "<rootDir>/src/tests/fileMock.js",
        "\\.(less|scss)$": "identity-obj-proxy",
    },
    reporters: ["default", "jest-junit"],
}
