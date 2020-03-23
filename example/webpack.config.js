const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'example.js'),

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  devtool: 'source-map',

  devServer: {
    contentBase: path.join(__dirname),
    publicPath: '/build/',
    historyApiFallback: true,
  },
};
