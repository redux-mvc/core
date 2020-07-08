const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
    entry: ["./src/index"],
    mode: "development",
    target: "web",
    output: {
        path: path.join(__dirname, "dist", "examples"),
        filename: "index.js",
    },
    resolve: {
        modules: ["node_modules", path.join(__dirname, "src")],
        alias: {
            TodoMVC: path.join(__dirname, "src", "Examples", "TodoMVC"),
            App: path.join(__dirname, "src", "Examples", "App"),
            "ui-kit": path.join(__dirname, "src", "Examples", "ui-kit"),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "redux-mvc",
        }),
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
                                modules: false,
                            },
                        ],
                        "@babel/preset-react",
                    ],
                    plugins: ["transform-class-properties"],
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
