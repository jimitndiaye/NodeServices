var path = require('path');
var webpack = require('webpack');
var merge = require('extendify')({ isDeep: true, arrays: 'concat' });
var ExternalsPlugin = require('webpack-externals-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('styles.css');
var devConfig = require('./webpack.config.dev');
var prodConfig = require('./webpack.config.prod');
var isDevelopment = process.env.ASPNET_ENV === 'Development';

module.exports = merge({
    target: "node",
    resolve: {
        extensions: [ '', '.js', '.ts' ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, include: /ClientApp/, loader: 'ts-loader' },
            { test: /\.html$/, loader: 'raw-loader' },
            { test: /\.css/, loader: extractCSS.extract(['css']) }
        ]
    },
    entry: {
        server: ['./ClientApp/boot-server.ts']
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'private'),
        filename: '[name].js',
        chunkFileName: '[id].[name].js',
        library: 'server',
        libraryTarget: 'commonjs2'
    },
    node: {
        __dirname: true,
        __filename: true
    },
    plugins: [
        new ExternalsPlugin({ type: 'commonjs', include: /node_modules/ })
    ]
}, isDevelopment ? devConfig : prodConfig);
