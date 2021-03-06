const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve('./dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: ['babel-loader']
      },
      {
        test: /\.s?(a|c)ss$/,
        use: [{ loader: MiniCssExtractPlugin.loader}, 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            options: { jsx: true }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin({sourceMap: false}),new OptimizeCSSAssetsPlugin()]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      logLevel: 'warn'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new CompressionPlugin(),
    new GenerateSW({
      cacheId: 'shame-dev',
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/vendor/],
      runtimeCaching: [
        {
          urlPattern: /vendor/,
          handler: 'CacheFirst'
        },
        {
          urlPattern: new RegExp('^https://fonts.googleapis.com/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: new RegExp('^https://fonts.gstatic.com/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: new RegExp('^https://pbs.twimg.com/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    })
  ],
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'source-map',
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    open: true
  }
};
