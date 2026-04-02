const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'assets/[name].css' }),
    new CopyPlugin({
      patterns: [
        { from: 'sections', to: 'sections' },
        { from: 'snippets', to: 'snippets' },
        { from: 'templates', to: 'templates' },
        { from: 'locales', to: 'locales' },
        { from: 'config', to: 'config' },
      ],
    }),
  ],
  output: {
    filename: 'assets/[name].js',
    path: path.resolve(__dirname, ''),
  },
});