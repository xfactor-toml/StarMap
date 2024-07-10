const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
      filename: 'bundle.js',
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin({
            baseUrl: __dirname,
            configFile: path.join(__dirname, 'tsconfig.prod.json')
        })]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/style.css'
      }),
    ],
});
