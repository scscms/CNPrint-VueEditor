let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let isProd = process.env.NODE_ENV === "production";
// 根据项目需求添加CSS预处理语言并安装相应的loader，以stylus-loader为例
let cssLang = [{
    name: 'css',
    reg: /\.css$/,
    loader: 'css-loader'
}, {
    name: 'stylus',
    reg: /\.styl$/,
    loader: "stylus-loader"
}, {
    name: 'less',
    reg: /\.less$/,
    loader: "less-loader"
}, {
    name: 'sass',
    reg: /\.scss$/,
    loader: "sass-loader"
}];

function genLoaders(lang) {
    let loaders = ['css-loader', 'postcss-loader'];
    if (lang.name !== 'css') {
        loaders.push(lang.loader);
    }
    if (isProd) {
        // 生产环境需要提取CSS
        loaders = ExtractTextPlugin.extract({
            use: loaders
        });
    } else {
        // 开发环境需要vue-style-loader将CSS提取到页面头部
        loaders.unshift('vue-style-loader');
    }
    return loaders;
}
// 各种CSS的loader
exports.styleLoaders = function () {
    let output = [];
    cssLang.forEach(lang => {
        output.push({
            test: lang.reg,
            use: genLoaders(lang)
        })
    });
    return output;
};
// vue-loader的options
exports.vueLoaderOptions = function () {
    let options = {
        loaders: {}
    };
    cssLang.forEach(lang => {
        options.loaders[lang.name] = genLoaders(lang);
    });
    return options;
};

/**
 * 多入口生成多页面
 * @returns {Array}
 */
exports.genHtmlPlugins = function () {
    let baseWebpackConfig = require('./webpack.base.config');
    let path = require('path');
    let plugins = [];
    Object.keys(baseWebpackConfig.entry).forEach(function (name) {
        plugins.push(
            new HtmlWebpackPlugin({
                minify:{
                    removeComments:true,    //移除HTML中的注释
                    collapseWhitespace:true    //删除空白符与换行符
                },
                filename: isProd ? path.resolve(__dirname, '../' + name + '.html') : name + '.html',
                template: 'index.tpl.html',
                chunks: isProd ? ['vendor', 'manifest', name] : [name],
                inject: true
            }))
    });
    return plugins
};
