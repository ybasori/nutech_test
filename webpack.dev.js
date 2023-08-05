/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
    proxy: {
      "*": {
        target: "https://yusuf-demo.online",
        // target: `http://localhost:8000`,
        changeOrigin: true,
        // secure: true,
      },
    },
  },
  output: {
    clean: true,
    publicPath: "http://localhost:3000/wp-content/themes/wpreact/",
  },
});
