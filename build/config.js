let path = require('path');
module.exports = {
    dev: {
        outputPath: path.resolve(__dirname, '../static'),
        outputPublicPath: '/',
        port: 8001,
    },
    prod: {
        outputPath: path.resolve(__dirname, '../static'),
        outputPublicPath: 'static/'
    },
    proxyTable: {
        /*'/api': {
            target: 'http://40.125.171.127:3888/',
            changeOrigin: true
        }*/
    }
};
