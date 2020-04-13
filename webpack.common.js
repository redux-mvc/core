const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    entry: ["./src/index"],
    target: "web",
    output: {
        path: path.join(__dirname, "dist"),
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: process.env.TITLE,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [path.join(__dirname, "src")],
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
}
