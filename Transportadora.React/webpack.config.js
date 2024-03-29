﻿const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebpackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
})

module.exports = {
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx", '.css', '.html'],
  },
  plugins: [htmlPlugin]
};