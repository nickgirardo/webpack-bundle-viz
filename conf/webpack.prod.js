const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.tsx',
  },
  devtool: 'inline-source-map',
  output: {
    publicPath: '/',
    // NOTE for some reason this dir seems to be based on the location of this file
    // all other paths seem to be based on the repo root
    path: path.resolve(__dirname, '../build'),
    filename: 'res/js/[name].[contenthash:8].js',
    chunkFilename: 'res/js/[name].chunk.js',
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.jsx', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
  optimization: {
    minimize: true,
  },
};

