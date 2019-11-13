const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack').NormalModuleReplacementPlugin;

module.exports = {

    entry: "./src/main.ts", //relative to root of the application
    devServer: {
        contentBase: path.join(__dirname, '.'),
    },
    devtool: false,
    output: {
        filename: './app.bundle.js',
    }, 
    resolve: {
        extensions: [".ts", ".js", ".tsx"]
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },

        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './index.html' //relative to root of the application
        }),
        new CopyPlugin([
            { from: './assets', to: './dist/assets' },
        ]),
        new NormalModuleReplacementPlugin(/'\.\.\/assets/,/'\.\.\/assets/)
    ]

}