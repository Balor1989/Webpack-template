const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) => isDev
    ? `[name].${ext}`
    : `[name].[contenthash].${ext}`;

 module.exports = {
    context: path.resolve(__dirname, 'src'),
     mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `./js/${filename('js')}`
    },
     plugins: [
         new HTMLWebpackPlugin({
             template: path.resolve(__dirname, 'src/index.html'),
             filename: 'index.html',
             minify: {
                 collapseWhitespace: isProd,
             },
         }),
         new CleanWebpackPlugin(),
     ]
  };