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
    ],

    optimization: {
        splitChunks: {              //提取公共模块
            cacheGroups: {
                vendor: {
                    name: 'vendors/vendors',
                    chunks: 'all',
                    minChunks: 3,    //分割前必须共享模块的最小块数
                    reuseExistingChunk: true
                }
            }
        }
    },
})



module.exports = config
