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
    }),

    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false}
    })
  ],

  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader' }
    ]
  }
};
