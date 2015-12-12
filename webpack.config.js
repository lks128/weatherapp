var
  webpack = require('webpack');

module.exports = {
  entry: "./src/main/javascript/app.js",
  output: {
    path: __dirname,
    filename: "target/bundle.js"
  },
  devServer: {
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'babel',
      query: {
        presets: ['react']
      }
    },{
      test: /\.less$/,
      loader: 'style!css!less'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
