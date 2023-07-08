const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'production',
  infrastructureLogging: {
    level: 'verbose',
    debug: true
  },
  entry: {
    index: {
      import: [
        './scss/index.scss',
        './js/index.js',
      ],
      library: {
        name: 'elucidate',
        type: 'assign',
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: 'sass',
              sassOptions: {
                indentWidth: 2,
                alertColor: true,
                quietDeps: true,
              },
            },
          }
        ],
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false,
            },
          }
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'all',
      name(module, chunks, cacheGroupKey) {
        const moduleFileName = module
          .identifier()
          .split('/')
          .reduceRight((item) => item);
        const allChunksNames = chunks.map((item) => item.name).join('~');
        return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
      },
    },
  },
  resolve: {
    alias: {
      mjx: path.resolve(__dirname, 'node_modules/mathjax-full/js'),
      whi: path.resolve(__dirname, 'node_modules/what-input/dist'),
      fdn: path.resolve(__dirname, 'node_modules/foundation-sites'),
    },
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: '[name].html',
      template: 'ejs/index.ejs',
      inject: false,
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  }
};

// vim: set ft=javascript:
