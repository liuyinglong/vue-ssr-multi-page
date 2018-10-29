const {serverConfigMap, clientConfigMap} = require('./multipageWebpackConfig')
const webpackClientBuildConfig = require('./webpack.client.build.config')
const webpack = require('webpack')
const entryPage = require("./entryFile/getEntryFile")
const path = require("path")
const baseTemplatePath = path.resolve(__dirname, '../src/template/index.template.html')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require("fs")

//生成服务端vue-ssr-server-build
console.log('server building...')
for (let pageName in serverConfigMap) {
    webpack(serverConfigMap[pageName], () => {
    })
}