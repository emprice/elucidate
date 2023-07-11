const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const apps = [
  {
    name: 'mathml',
    title: 'LaTeX to MathML tool',
    template: 'ejs/mathml.ejs',
    stylesheets: [
      './scss/mathml.scss',
    ],
  },
  {
    name: 'colormap',
    title: 'Colormap designer tool',
    template: 'ejs/colormap.ejs',
    stylesheets: [
      './scss/colormap.scss',
    ],
    otherImports: [
      './js/tristimulus.bin.wasm',
    ],
  },
];

const entryPoints = apps.reduce((acc, cur) => {
  return {
    ...acc,
    [cur.name]: {
      import: [
        ...(cur.otherImports || []),
        ...(cur.stylesheets || []),
        (cur.script || `./js/${cur.name}.js`),
      ],
      library: {
        name: cur.name,
        type: 'var',
      },
    },
  }
}, {});

console.log(entryPoints);

const htmlPlugins = apps.map((obj) => {
  return new HtmlWebpackPlugin({
    filename: `${obj.name}.html`,
    template: obj.template,
    inject: false,
    chunks: [
      obj.name,
      'defaultVendors',
    ],
    templateParameters: {
      entryName: obj.name,
      pageTitle: obj.title,
    }
  });
});

module.exports = {
  target: 'web',
  mode: 'production',
  infrastructureLogging: {
    level: 'verbose',
    debug: true
  },
  entry: entryPoints,
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /compute\.js$/,
        use: [
          {
            loader: 'exports-loader',
            options: {
              exports: 'default compute',
            },
          },
        ],
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].wasm',
        }
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
      chunks: 'initial',
      cacheGroups: {
        defaultVendors: {
          filename(pathData) {
            return `${pathData.chunk.name}~bundle.js`;
          },
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split('/')
              .reduceRight((item) => item);
            const allChunksNames = chunks.map((item) => item.name).join('~');
            return `vendor-${allChunksNames}-${moduleFileName}`;
          },
          test(module) {
            return module.type === 'javascript/auto';
          },
        },
        common: {
          filename(pathData) {
            return `${pathData.chunk.name}.js`;
          },
          name(module, chunks, cacheGroupKey) {
            const allChunksNames = chunks.map((item) => item.name).join('~');
            return `common-${allChunksNames}`;
          },
          test(module) {
            return module.type === 'javascript/auto';
          },
        },
        styles: {
          filename(pathData) {
            return `${pathData.chunk.name}.css`;
          },
          name(module, chunks, cacheGroupKey) {
            const allChunksNames = chunks.map((item) => item.name).join('~');
            return `styles-${allChunksNames}`;
          },
          test(module) {
            // HACK: webpack kept putting the stylesheets in oddly-named
            // files; this forces any extracted css into the "styles" chunk
            return module.type === 'css/mini-extract';
          },
        },
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
    fallback: {
      // gsl tries to access the filesystem, but those components aren't
      // even needed and just cause compile errors when building for web;
      // disable them completely here
      fs: false,
      path: false,
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin(),
    ...htmlPlugins,
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  }
};

// vim: set ft=javascript:
