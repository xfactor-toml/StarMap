const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/script.js',
  
  output: {
    filename: 'game.bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js']
  },

  watchOptions: {
    ignored: /node_modules/
  },

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9184,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    },
    overlay: true
  },

}