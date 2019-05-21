const webpackClientBuildConfig = require('./webpack.client.build.config')
const webpack = require('webpack')
const entryPage = require("./entryFile/getEntryFile")
const path = require("path")
const baseTemplatePath = path.resolve(__dirname, '../src/template/index.template.html')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require("fs")


//生成模板文件
webpackClientBuildConfig.entry = entryPage.clientEntry
webpackClientBuildConfig.output.filename = "public/js/[name].js"

//提取公共文件
let chunks = Object.keys(entryPage.clientEntry)


let buildConfig = {}
//生成模板文件配置
for (let pageName in entryPage.page) {
    let htmlWebpackConfig = {
        filename: "template/" + entryPage.page[pageName].pathName + ".html",
        template: entryPage.page[pageName].templatePath || baseTemplatePath,
        inject: true,
        chunks: (function () {
            return ["vendors/vendors", entryPage.page[pageName].pathName]
        })(),
        hash: true
    }

    //以文件的形式保存信息，方便读取
    buildConfig[pageName] = {
        serverBundle:`server/${pageName}/vue-ssr-server-bundle.json`,
        templatePath:htmlWebpackConfig.filename,
        pathName:entryPage.page[pageName].pathName
    }
    webpackClientBuildConfig.plugins.push(new HtmlWebpackPlugin(htmlWebpackConfig))
}


//生成配置文件
let buildConfigPath = path.resolve(webpackClientBuildConfig.output.path, `buildConfig.json`)
console.log("buildConfig creating...")
fs.writeFileSync(buildConfigPath, JSON.stringify(buildConfig, null, 4))

//编译客户端
console.log('client building...')
webpack(webpackClientBuildConfig, () => {
})