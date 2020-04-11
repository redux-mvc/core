const merge = require("webpack-merge")

const common = require("./webpack.common.js")

module.exports = merge(common, {
    devServer: {
        contentBase: "./dist",
        hot: true,
        port: 3000,
        historyApiFallback: true,
    },
    devtool: "eval",
})
