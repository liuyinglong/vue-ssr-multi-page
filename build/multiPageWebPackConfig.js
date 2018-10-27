const merge = require('webpack-merge')
const serverConfig = require('./webpack.server.config')
const clientConfig = require("./webpack.client.config")
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const {page} = require("./entryFile/getEntryFile")

let serverConfigMap = {}, clientConfigMap = {}
for (let name in page) {

    serverConfigMap[name] = merge({}, serverConfig, {
        entry: page[name].serverEntryPath,
        plugins: [
            new VueSSRServerPlugin({
                filename: `server/${name}/vue-ssr-server-bundle.json`
            })
        ]
    })

    clientConfigMap[name] = merge({}, clientConfig, {
        entry: {
            [name]: page[name].clientEntryPath
        },
        output: {
            filename: `js/[name].js` //dist目录
        },
        plugins: [
            new VueSSRClientPlugin({
                filename: `server/${name}/vue-ssr-client-manifest.json`
            })
        ]
    })

}

module.exports = {serverConfigMap, clientConfigMap}