const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    entry: ["./src/index"],
    target: "web",
    output: {
        path: path.join(__dirname, "dist", "main"),
        filename: "index.js",
    },
    resolve: {
        modules: ["node_modules", path.join(__dirname, "src")],
        alias: {
            TodoMVC: path.join(__dirname, "src", "Examples", "TodoMVC"),
            App: path.join(__dirname, "src", "Examples", "App"),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: process.env.TITLE,
        }),
        new CleanWebpackPlugin(),
    ],
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
            {
                test: /\.(png|jpg|gif|GIF|ttf|woff|eot|svg)$/,
                loader: "file-loader?name=assets/[name].[ext]",
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devServer: {
        contentBase: "./dist",
        hot: true,
        port: 3000,
        historyApiFallback: true,
    },
    devtool: "eval",
}
