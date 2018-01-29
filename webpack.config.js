const path = require('path');
const webpackModule = require('./webpack-module');
const webpackPlugin = require('./webpack-plugin');

module.exports = (env) => {
  const dest = path.resolve(__dirname, './public');

  return {
    entry: {
      // bundles the core
      'scripts/bundle': path.resolve(__dirname, './src/index.js')
    },
    output: {
      filename: '[name].js',
      chunkFilename: 'fragments/[name].fragment.[id].js',
      path: dest
    },
    resolve: {
      modules: [
        path.resolve(__dirname, './src/components'),
        path.resolve(__dirname, './src/pages'),
        path.resolve(__dirname, './src/middlewares'),
        path.resolve(__dirname, './src/mixins'),
        path.resolve(__dirname, './src/styles'),
        path.resolve(__dirname, './node_modules')
      ]
    },
    module: webpackModule(env),
    plugins: webpackPlugin(env),
    devServer: {
      contentBase: './src',
      compress: true,
      overlay: {
        errors: true
      },
      port: 3000,
      historyApiFallback: {
        index: 'index.html'
      },
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
};