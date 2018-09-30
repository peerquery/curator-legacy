// webpack.config.js
var path = require('path'),
    webpack_entry = require('./src/configs/webpack-entries'),
    miniCssExtractPlugin = require('mini-css-extract-plugin'),
    webpack = require('webpack'),
    env = require('dotenv').config();

module.exports = {
    entry: webpack_entry,
    output: {
        path: path.join(__dirname, 'public', 'build', 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new miniCssExtractPlugin({ filename: '[name].css' }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    miniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    stats: {
        colors: true,
    },
    devtool: process.env.NODE_ENV == 'debugging' ? 'source-map' : false,
    mode:
        process.env.NODE_ENV == 'production' ||
        process.env.NODE_ENV == 'staging'
            ? 'production'
            : 'development',
    //travis ci uses NODE_ENV='staging', if set to 'production' it will not install devDependencies - which are required for building including 'webpack'
};
