const { resolve } = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('./src/utils/modified-copy-webpack-plugin/copy-webpack-plugin');
const moduleConf = require('./webpack-module.config');
const nomoduleConf = require('./webpack-nomodule.config');
const IS_DEV_SERVER = !!process.argv.find(arg => arg.includes('--mode=development'));

const copyStatics = {
  copyPolyfills: [
    {
      from: resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/*.js'),
      to: 'vendor/[name].[ext]'
    },
    {
      from: resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/*.map'),
      to: 'vendor/[name].[ext]'
    },
    {
      from: resolve(__dirname, './node_modules/es5-shim/es5-shim.min.js'),
      to: 'vendor/es5-shim.js'
    },
    {
      from: resolve(__dirname, './node_modules/es5-shim/es5-sham.min.js'),
      to: 'vendor/es5-sham.js'
    },
    {
      from: resolve(__dirname, './node_modules/es6-shim/es6-shim.min.js'),
      to: 'vendor/es6-shim.js'
    },
    {
      from: resolve(__dirname, './node_modules/es6-shim/es6-sham.min.js'),
      to: 'vendor/es6-sham.js'
    },
    {
      from: resolve(__dirname, './node_modules/es6-promise/dist/es6-promise.min.js'),
      to: 'vendor/es6-promise.js'
    },
    {
      from: resolve(__dirname, './node_modules/intersection-observer/intersection-observer.js'),
      to: 'vendor/intersection-observer.js'
    },
    {
      from: resolve(__dirname, './node_modules/@webcomponents/shadycss/scoping-shim.min.js'),
      to: 'vendor/scoping-shim.js'
    },
    {
      from: resolve(__dirname, './node_modules/whatwg-fetch/fetch.js'),
      to: 'vendor/fetch.js'
    },
    {
      from: resolve(__dirname, './src/assets'),
      to: 'assets'
    }
  ]
};

const shared = env => {
  const IS_MODULE_BUILD = env.BROWSERS === 'module';

  return {
    entry: {
      'bundle': resolve(__dirname, 'src/index.js')
    },
    output: {
      path: resolve(__dirname, 'public'),
      chunkFilename: IS_MODULE_BUILD ? 'module.[name].fragment.[id].js' : '[name].fragment.[id].js',
      filename: IS_MODULE_BUILD ? 'module.[name].js' : '[name].js'
    },
    resolve: {
      modules: [
        resolve(__dirname, 'node_modules'),
        resolve(__dirname, 'src/components'),
        resolve(__dirname, 'src/pages'),
        resolve(__dirname, 'src/middlewares'),
        resolve(__dirname, 'src/mixins'),
        resolve(__dirname, 'src/styles')
      ]
    },
    plugins: [
      new CopyWebpackPlugin(copyStatics.copyPolyfills)
    ]
  };
};

module.exports = (env = {}) => merge(env.BROWSERS === 'module' ? moduleConf(IS_DEV_SERVER) : nomoduleConf(), shared(env));
