const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: './src/index.ts',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: './'
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'd.ts']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'ts-shader-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: path.resolve(__dirname, 'public', 'assets'),
                    to: './assets'
                },
                {
                    from: '**/*',
                    context: path.resolve(__dirname, 'public', 'js'),
                    to: './js'
                },
                {
                    from: '**/*',
                    context: path.resolve(__dirname, 'public', 'gui'),
                    to: './gui'
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.css',
        }),
        new VueLoaderPlugin()
    ],

    watchOptions: {
        ignored: /node_modules/
    },

    devServer: {
        port: 9184,
        static: {
            directory: path.join(__dirname, 'build'),
        },
        compress: true,
        client: {
            overlay: true
        }
    },

}