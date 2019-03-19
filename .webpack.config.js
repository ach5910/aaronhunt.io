const webpack = require('webpack');
const meteorExternals = require('webpack-meteor-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './imports/startup/client/index.html',
  filename: 'index.html',
  inject: 'body'
})
const clientConfig = (env) => {
  const BUILD_TYPE = env && env.BUILD_TYPE ? env.BUILD_TYPE : "dev";  
  return {
  entry: ['./imports/startup/client/polyfills.js', './client/init.js'],
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ["babel-preset-env"],
            plugins: [
              "babel-plugin-transform-class-properties",
              "babel-plugin-transform-react-jsx",
              "babel-plugin-transform-object-rest-spread"
            ]
        }
      },
      {
        test: /\.(s*)css$/,
        use: [
            BUILD_TYPE === "dev" ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.graphql', '.png', '.svg']
  },
  externals: [
    meteorExternals()
  ],
  devServer: {
    hot: true
  }
}};

const serverConfig = {
  entry: [
    './server/init.js'
  ],
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ["babel-preset-env"],
            plugins: [
              "babel-plugin-transform-class-properties",
              "babel-plugin-transform-object-rest-spread"
            ]
        }
      }]
    },
  target: 'node',
  devServer: {
    hot: true
  },
  externals: [
    meteorExternals(), nodeExternals()
  ]
};

module.exports = [clientConfig, serverConfig];