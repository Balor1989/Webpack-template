const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


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
    devServer:{
        historyApiFallback:{
            index:'build/index.html'
        },
        static: path.resolve(__dirname, 'build'),
        open: true,
        compress: true,
        port: 4444,
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
         new MiniCssExtractPlugin({
             filename: `./css/${filename('css')}`
         })
     ],
     module:{
         rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ],
              },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
         ]
     }
  };