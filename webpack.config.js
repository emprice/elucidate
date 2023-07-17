const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const apps = [
  {
    entry: 'mathml',
    name: (e) => 'mathml',
    title: 'LaTeX to MathML tool',
    template: './ejs/mathml.ejs',
    stylesheets: [
      './scss/mathml.scss',
    ],
  },
  {
    entry: 'colormap',
    name: (e) => 'colormap',
    title: 'Colormap designer tool',
    template: './ejs/colormap.ejs',
    stylesheets: [
      './scss/colormap.scss',
    ],
    otherImports: [
      './js/tristimulus.bin.wasm',
    ],
  },
  {
    entry: 'tutorial',
    name: (e) => `tutorial/${e}`,
    title: 'HTML tutorial',
    template: './ejs/tutorial.ejs',
    script: './js/tutorial.js',
    stylesheets: [
      './scss/tutorial.scss',
    ],
    pages: [
      'basic',
      'skeleton',
      'cheatsheet',
    ],
    partials: [
      {
        name: 'body',
        filename: (e) =>
          path.resolve(__dirname, './ejs/partials', `${e}.html`),
      },
    ],
  },
];

const entryPoints = apps.reduce((acc, cur) => {
  return {
    ...acc,
    [cur.entry]: {
      import: [
        ...(cur.otherImports || []),
        ...(cur.stylesheets || []),
        (cur.script || `./js/${cur.entry}.js`),
      ],
      library: {
        name: cur.entry,
        type: 'var',
      },
    },
  };
}, {});

var htmlPlugins = [];
apps.forEach((obj) => {
  (obj.pages || [obj.name]).forEach((page) => {
    htmlPlugins.push(new HtmlWebpackPlugin({
      filename: `${obj.name(page)}.html`,
      template: obj.template,
      inject: 'body',
      publicPath: process.env.PUBLIC_PATH || '/',
      base: process.env.BASE_URL || false,
      chunks: [
        obj.entry,
        'defaultVendors',
      ],
      templateParameters: {
        pageTitle: obj.title,
        partials: (obj.partials || []).reduce((acc, cur) => {
          return {
            ...acc,
            [cur.name]: fs.readFileSync(cur.filename(page)),
          };
        }, {}),
      }
    }));
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
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts-[name][ext]',
        }
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
          filename: 'assets/[name].wasm',
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
            return `assets/${pathData.chunk.name}~bundle.js`;
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
            return `assets/${pathData.chunk.name}.js`;
          },
          name(module, chunks, cacheGroupKey) {
            const allChunksNames = chunks.map((item) => {
              return item.name.split('/')[0];
            }).join('~');
            return `common-${allChunksNames}`;
          },
          test(module) {
            return module.type === 'javascript/auto';
          },
          minChunks: 2,
        },
        styles: {
          filename(pathData) {
            return `assets/${pathData.chunk.name}.css`;
          },
          name(module, chunks, cacheGroupKey) {
            const allChunksNames = chunks.map((item) => {
              return item.name.split('/')[0];
            }).join('~');
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
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css',
    }),
    new CssoWebpackPlugin(),
    ...htmlPlugins,
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (pathData) => {
      return `assets/${pathData.chunk.name.split('/')[0]}.bundle.js`;
    },
    clean: true,
  }
};

// vim: set ft=javascript:
