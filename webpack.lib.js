const path = require("path")
const merge = require("webpack-merge")

const common = require("./webpack.common.js")
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    entry: "./src/redux-mvc",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "redux-mvc.js",
        library: "redux-mvc",
        libraryTarget: "umd",
    },
    plugins: [
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
        }),
    ],
    externals: {
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "react",
        },
        redux: {
            commonjs: "redux",
            commonjs2: "redux",
            amd: "redux",
        },
    },
})
