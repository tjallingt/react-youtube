/* eslint-disable no-var */

var path = require('path');

module.exports = {
  entry: path.join(__dirname, '../example/example.js'),

  output: {
    path: path.join(__dirname, '../example/build'),
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },

  devtool: 'source-map',

  devServer: {
    contentBase: path.join(__dirname, '../example/'),
    publicPath: '/build/',
    historyApiFallback: true,
  },
};
