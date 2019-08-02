const merge = require("webpack-merge")

const common = require("./webpack.common.js")

module.exports = merge(common, {
    entry: ["react-hot-loader/patch"],
    devServer: {
        contentBase: "./dist",
        hot: true,
    },
    devtool: "eval",
    resolve: {
        alias: {
            "react-dom": "@hot-loader/react-dom",
        },
    },
})
