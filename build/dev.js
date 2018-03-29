let webpack = require('webpack');
let proxy = require('http-proxy-middleware');
let webpackDevServer = require('webpack-dev-server');
let devConfig = require("./webpack.dev.config");
let config = require("./config");
let compiler = webpack(devConfig);
let server = new webpackDevServer(compiler, {
    hot: true,
    quiet: true,
    publicPath: config.dev.outputPublicPath,
    stats: { colors: true }
});

let proxyTable = config.proxyTable;
Object.keys(proxyTable).forEach(function (key) {
    let options = typeof options === 'string' ? { target: options } : proxyTable[key];
    server.use(key, proxy(options));
});

server.listen(config.dev.port, "0.0.0.0");
let url = `http://localhost:${config.dev.port}/`;
let opn = require('opn');

server.middleware.waitUntilValid(function() {
    console.log(`> Listening at ${url}`);
    opn(`${url}`);
});
