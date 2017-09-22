let webpack = require('webpack');
let HtmlPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let loaders = require('./webpack.config.loaders')();
let path = require('path');
//let handlebars = require('handlebars');

loaders.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader'
    })
});

module.exports = {
    entry: {
        main: './src/index.js',
        friendsfilter: './src/ff.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.hbs$/, 
                loader: 'handlebars-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                drop_debugger: false
            }
        }),
        new ExtractTextPlugin('styles.css'),
        new HtmlPlugin({
            title: 'main',
            template: 'index.hbs',
            chunks: ['main']
        }),
        new HtmlPlugin({
            title: 'Другофильтр',
            template: 'friendsfilter.hbs',
            chunks: ['friendsfilter']
        }),
        new CleanWebpackPlugin(['dist'])
    ]
};
