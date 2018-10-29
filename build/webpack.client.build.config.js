const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
    resolve: {
        alias: {
            'create-api': './create-api-client.js'
        }
    },
    plugins: [
        // strip dev-only code in Vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        })
    ]
})




if (isProd) {
    config.plugins = config.plugins.concat([
        new webpack.BannerPlugin({
            banner: "version:1.0.0 \n" +
                "author:liuyinglong \n" +
                "date:" + new Date() + " \n" +
                "mail:liuyinglong@utimes.cc",
        }),
    ])
}

module.exports = config
