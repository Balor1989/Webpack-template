const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");


const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
    const configObj = {
     splitChunks: {
         chunks: 'all'
     }
    };
    if (isProd) {
        configObj.minimizer = [
         new OptimizeCssAssetsWebpackPlugin (),
         new TerserWebpackPlugin()
        ];
    }
    return configObj;
};

const plugins = () => {
    const basePlugins = [
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
    ];
     if(isProd){
         basePlugins.push(
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    }),
         )
     }
    return basePlugins;
}

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
         client: {
      logging: 'error'
    },
        compress: true,
        port: 4444,
    },
    optimization: optimization(),
     plugins: plugins(),
     devtool: isProd ? false : "source-map",
     module:{
         rules: [
             {
                 test: /\.html$/,
                use:["html-loader"]
             },
             {
                test: /\.js$/,
                exclude: /node_modules/, 
                use: ['babel-loader'],
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
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
        
            {
                test: /\.(?:|woff2)$/,
                use: [{
                    loader:'file-loader',
                    options: {
                    name: `./fonts/${filename('[ext]')}`     
                    },
                }],
            },
         ]
     }
  };




  








