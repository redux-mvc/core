const baseConfig = require("../webpack.dev.js")

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => ({
    ...config,
    resolve: {
        modules: baseConfig.resolve.modules,
    },
})
