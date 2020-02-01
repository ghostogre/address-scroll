const path = require("path");
const WebpackMerge = require("webpack-merge");
const webpackConfig = require("./webpack.config");

module.exports = WebpackMerge(webpackConfig, {
  mode: "production",
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "ying-address-scroll.js",
    publicPath: "../dist/",
    library: "ying-address-scroll",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: { // 不打包vue
    vue: "vue"
  }
})
