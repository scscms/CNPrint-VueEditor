// 设定为生产环境
process.env.NODE_ENV = 'production';
let webpack = require('webpack');
let merge = require('webpack-merge');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let path = require('path');
let baseWebpackConfig = require('./webpack.base.config');
let utils = require('./utils');
let config = require('./config');

module.exports = merge(baseWebpackConfig, {
    output: {
        path: config.prod.outputPath,
        publicPath: config.prod.outputPublicPath,
        filename: 'js/[name].js?[chunkhash]'
    },
    module: {
        rules: utils.styleLoaders()
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new ExtractTextPlugin({
            allChunks: true,
            filename: "css/[name].css?[contenthash:8]"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names:'manifest',
            chunks: ['vendor']
        }),
        new webpack.optimize.UglifyJsPlugin(),
        ...utils.genHtmlPlugins()
    ]
});
