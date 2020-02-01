const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const WebpackMerge = require("webpack-merge");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = WebpackMerge(webpackConfig, {
  mode: "development",
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, "../src/main.js")
  ],
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, "../dist")
  },
  devServer: {
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunks: ['main'] // 与入口文件对应的模块名
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin()
  ]
})