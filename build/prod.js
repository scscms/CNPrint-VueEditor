let webpack = require("webpack");
let prodWebpackConfig = require('./webpack.prod.config');
webpack(prodWebpackConfig, function(err, stats) {
    process.stdout.write(stats.toString());
});
