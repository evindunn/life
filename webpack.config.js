const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const env = process.env["NODE_ENV"] || "production";

module.exports = {
    entry: './src/index.js',
    mode: env,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.ejs'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};