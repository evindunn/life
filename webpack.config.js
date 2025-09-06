const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const env = process.env["NODE_ENV"] || "production";

module.exports = {
    entry: './src/index.js',
    mode: env,
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.[contenthash].css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
            {
                test: /\.json$/,
                type: 'asset/resource',
            }
        ],
    },
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ]
    },
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        liveReload: true,
        open: true,
    }
};