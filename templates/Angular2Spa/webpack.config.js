var path = require('path');
var webpack = require('webpack');
var merge = require('extendify')({ isDeep: true, arrays: 'concat' });
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('styles.css');
var devConfig = require('./webpack.config.dev');
var prodConfig = require('./webpack.config.prod');
var ExternalsPlugin = require('webpack-externals-plugin')
//var vendorConfig = require('./webpack.config.vendor');

var isDevelopment = process.env.ASPNET_ENV === 'Development';

var loaders = [
            { test: /\.ts$/, include: /ClientApp/, loader: 'ts-loader' },
            { test: /\.html$/, loader: 'raw-loader' },
            { test: /\.css/, loader: extractCSS.extract(['css']) }
];
var vendorReferencePlugin = new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./wwwroot/dist/vendor-manifest.json')
});

var vendorConfig = {
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            { test: /\.css/, loader: new ExtractTextPlugin('vendor.css').extract(['css']) }
        ]
    },
    entry: {
        vendor: [
            'jquery',
            'bootstrap',
            'bootstrap/dist/css/bootstrap.css',
            'style-loader',
            'angular2/bundles/angular2-polyfills',
            'angular2/core',
            'angular2/router'
        ]
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        filename: '[name].js',
        library: '[name]_[hash]',
    },
    plugins: [
        extractCSS,
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
            name: '[name]_[hash]'
        })
    ].concat(isDevelopment ? [] : [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            minimize: true,
            mangle: true // Due to https://github.com/angular/angular/issues/6678
        })
    ])
};

var workerConfig = merge({
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: loaders
    },
    entry: {
        worker: ['./ClientApp/boot-worker.ts']
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        filename: '[name].js',
        chunkFileName: '[id].[name].js',
        publicPath: '/dist/'
    },
    plugins: [
        vendorReferencePlugin
    ]
}, isDevelopment ? devConfig : prodConfig);

var clientConfig = merge({
    target: "webworker",
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: loaders
    },
    entry: {
        main: ['./ClientApp/boot-client.ts']
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        filename: '[name].js',
        chunkFileName: '[id].[name].js',
        publicPath: '/dist/'
    },
    plugins: [
        extractCSS,
        vendorReferencePlugin
    ]
}, isDevelopment ? devConfig : prodConfig);

var serverConfig = merge({
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: loaders
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
module.exports = [vendorConfig, workerConfig, clientConfig, serverConfig];
