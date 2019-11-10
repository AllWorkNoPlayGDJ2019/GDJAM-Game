const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {

    entry: "./src/main.ts", //relative to root of the application
    devServer: {
    },
    devtool:false,
    output: {
        filename: 'app.bundle.js',
        //   path: path.resolve(__dirname, 'dist'),
    },
    resolve:{
        extensions:[".ts",".js",".tsx"]
    },
    mode: 'development',
    module: {
        rules: [
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
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
        })
    ]

}