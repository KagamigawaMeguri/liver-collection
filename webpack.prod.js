/*
 * @Author: zy9@github.com/zy410419243 
 * @Date: 2018-05-20 13:48:08 
 * @Last Modified by: zy9
 * @Last Modified time: 2018-06-17 17:31:38
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const WebpackOnBuildPlugin = require('on-build-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { logInfo } = require('./webpack.common');

const buildPath = __dirname + '/dist/';
const dev = process.argv.includes('development') ? true : false;

let plugins = [
    new HtmlWebpackPlugin({ // 生成html
        template: './src/index.html',
        chunks: ['popup'],
        hash: true,
        minify: {
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
            collapseWhitespace: true,
        }
    }),
    new CopyWebpackPlugin([
        {
            from: __dirname + '/src/assets',
            to: __dirname + '/dist/assets'
        },
        {
            from: __dirname + '/manifest.json',
            to: __dirname + '/dist',
            force: true
        },
        {
            from: __dirname + '/contentScript/css',
            to: __dirname + '/dist/assets/contentScript'
        }
    ]),
    // new MiniCssExtractPlugin({
    //     filename: dev ? '[name].[chunkHash:8].css' : '[name].css',
    //     chunkFilename: '[id].[chunkHash:8].css'
    // })
];

dev && plugins.push(new CleanWebpackPlugin(['dist'], {
    exclude: ['mainifest.json'],
    verbose: false
}));

!dev && plugins.push(new CleanWebpackPlugin(['dist'], {
    verbose: false
}));

const options = {
    mode: dev ? 'development' : 'production',
    watch: dev,
    devServer: {
        port: 9099
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: dev ? 'source-map' : '',
    entry: {
        popup: __dirname + '/src',
        contentScript: __dirname + '/contentScript',
        background: __dirname + '/background'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: dev ? 'vendor/[name].[chunkHash:8].js' : 'vendor/[name].js'
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] // MiniCssExtractPlugin.loader,
            },
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
        ]
    }
}

webpack(options, (err, stats) => logInfo(err, stats, dev));