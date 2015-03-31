/**
 * Module dependencies
 */

var webpack = require('webpack');

/**
 * Webpack configuration
 */

module.exports = {
  entry: './example/example.js',

  output: {
    filename: './example/build/bundle.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader', 'autoprefixer-loader'] }
    ]
  }
};
