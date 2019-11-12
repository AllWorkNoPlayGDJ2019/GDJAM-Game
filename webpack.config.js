const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack').NormalModuleReplacementPlugin;

module.exports = {

    entry: "./src/main.ts", //relative to root of the application
    devServer: {
    },
    devtool: false,
    output: {
        filename: './dist/app.bundle.js',
        //   path: path.resolve(__dirname, 'dist'),
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
            filename: './dist/index.html' //relative to root of the application
        }),
        new CopyPlugin([
            { from: './assets', to: './dist/assets' },
        ]),
        new NormalModuleReplacementPlugin(/'\.\.\/assets/,/'\.\.\/assets/)
    ]

}