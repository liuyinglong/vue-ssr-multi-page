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
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: `vendor/lib`,
            minChunks: function (module) {
                // a module is extracted into the vendor chunk if...
                return (
                    // it's inside node_modules
                    /node_modules/.test(module.context) &&
                    // and not a CSS file (due to extract-text-webpack-plugin limitation)
                    !/\.css$/.test(module.request)
                )
            }
        }),

        // extract webpack runtime & manifest to avoid vendor chunk hash changing
        // on every build.
        new webpack.optimize.CommonsChunkPlugin({
            name: `manifest`
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
