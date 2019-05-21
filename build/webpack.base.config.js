const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    devtool: isProd ? false : '#cheap-module-source-map',
    mode: isProd ? 'production' : 'development',

    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: "/dist/",
    },

    resolve: {
        alias: {
            'public': path.resolve(__dirname, '../public'),
            "@": path.resolve(__dirname, "../src")
        }
    },

    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[ext]?[hash]'
                }
            }
        ]
    },

    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },

    plugins: isProd
        ? [
            new VueLoaderPlugin(),

            //过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。
            new webpack.optimize.ModuleConcatenationPlugin(),

            //提取css
            new ExtractTextPlugin({
                filename: 'css/common.css?[hash]'
            })
        ]
        : [
            new VueLoaderPlugin(),
            new FriendlyErrorsPlugin()
        ]
}

//开发环境loader配置
let developmentLoader = [
    {
        test: /\.scss$/,
        use: [
            {
                loader: "style-loader",
                options: {
                    sourceMap: true
                }
            },
            {
                loader: "css-loader",
                options: {
                    sourceMap: true,
                    importLoaders: 2,
                    modules: "global",
                }
            },
            {
                loader: "postcss-loader",
                options: {
                    plugins: [
                        require('precss')({/* ...options */}),
                        require('autoprefixer')({/* ...options */})
                    ]
                }
            },
            {
                loader: "sass-loader",
                options: {
                    sourceMap: true
                }
            }
        ]
    }
]

//生产环境loader配置
let productionLoader = [
    {
        test: /\.scss$/,
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader",
                options: {
                    importLoaders: 2,
                    modules: "global"
                }
            },
            {
                loader: "postcss-loader",
                options: {
                    plugins: [
                        require('precss')({/* ...options */}),
                        require('autoprefixer')({/* ...options */})
                    ]
                }
            },
            {
                loader: "sass-loader"
            }
        ]
    }
]

if (isProd) {
    module.exports.module.rules = module.exports.module.rules.concat(productionLoader)
} else {
    module.exports.module.rules = module.exports.module.rules.concat(developmentLoader)
}