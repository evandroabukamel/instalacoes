var path = require('path');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
const embedFileSize = 131072;
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, '../src/main.js'),
      path.resolve(__dirname, '../src/styles/colors.sass'),
      path.resolve(__dirname, '../src/styles/main.sass'),
      path.resolve(__dirname, '../src/styles/main.scss'),
    ],
    vendor: [
      'babel-polyfill',
      'lodash',
      'vue',
      'vuex',
      'vue-router',
      'vuex-router-sync',
      'vue-nprogress',
      'camelcase',
      'camelcase-keys',
      'quick-lru',
      'axios',
      'vue-axios',
    ],
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      /* {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          resolve('src'),
          resolve('test')
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          loaders: {
            js: 'babel-loader?presets[]=es2015,presets[]=stage-2'
          }
        }
      }, */
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [
          resolve('src'),
          resolve('node_modules/camelcase'),
          resolve('node_modules/camelcase-keys'),
          resolve('node_modules/quick-lru'),
          resolve(
            'node_modules/vue-flatpickr-component'
          ) /*,
          resolve('test') */,
        ],
        query: {
          presets: [require.resolve('babel-preset-env')],
        },
      },
      {
        /* As imagens devem ficar na pasta /static/assets/images */
        test: /\.(png|jpg|gif)$/,
        exclude: /(node_modules)/,
        loader: `url-loader?limit=${embedFileSize}`,
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: `file-loader?limit=${embedFileSize}&mimetype=application/font-woff`,
        options: {
          name: utils.assetsPath('fonts/[name].[ext]'),
        },
      },
      {
        test: /\.(ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          limit: embedFileSize,
          name: utils.assetsPath('fonts/[name].[ext]'),
        },
      },
    ],
  },
};
