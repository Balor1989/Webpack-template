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
        filename: `./js/${filename('js')}`,
        publicPath: ''
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
                 test: /\.html$/,
                use:["html-loader"]
             },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ],
              },
              {
                    test: /\.s[ac]ss$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    },
                "css-loader", 
                "sass-loader"
                ],
                },
            {
                test: /\.(?:|gif|svg|png|jpg|jpeg)$/,
                use: [{
                    loader:'file-loader',
                    options: {
                    name: `./img/${filename('[ext]')}`     
                    },
                }],
            },
         ]
     }
  };




  








