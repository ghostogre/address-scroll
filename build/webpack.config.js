const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
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
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        },
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        // 只打包src目录下的文件
        include: path.resolve(__dirname, "../src")
      }
    ]
  },
  resolve: {
    alias: {
      "vue$": "vue/dist/runtime.esm.js",
      " @": path.resolve(__dirname, "../src")
    },
    extensions: ["*", ".js", ".json", ".vue"]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  externals: { // 不打包vue
    vue: "vue"
  }
}