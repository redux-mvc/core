const baseConfig = require("../webpack.common.js")
const merge = require("webpack-merge")

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => ({
    ...config,
    resolve: {
        modules: baseConfig.resolve.modules,
    },
})
