const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
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
        use: {
          loader: "vue-loader",
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        },
        // 只打包src目录下的文件
        include: path.resolve(__dirname, "../src")
      }
    ]
  },
  resolve: {
    alias: {
      "vue$": "vue/dist/vue.runtime.esm.js",
      " @": path.resolve(__dirname, "../src")
    },
    extensions: ["*", ".js", ".json", ".vue"]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}