const path = require("path")

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/redux-mvc",
    output: {
        path: path.join(__dirname, "dist", "lib"),
        filename: "redux-mvc.js",
        library: "redux-mvc",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [path.join(__dirname, "src")],
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                useBuiltIns: "entry",
                            },
                        ],
                        "@babel/preset-react",
                    ],
                    plugins: [
                        "transform-class-properties",
                        "@babel/plugin-transform-runtime",
                    ],
                },
            },
        ],
    },
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
    optimization: {
        runtimeChunk: true,
    },
}
