const {serverConfigMap,clientConfigMap} = require('./multipageWebpackConfig');
const webpack = require('webpack');

console.log('server building...');
for (let page in serverConfigMap) {
    webpack(serverConfigMap[page],()=>{});
    webpack(clientConfigMap[page],()=>{});
}