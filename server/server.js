let express = require("express")
let app = express()
let path = require("path")
const LRU = require('lru-cache')
const baseTemplatePath = path.resolve(__dirname, '../src/template/index.template.html')
const {createBundleRenderer} = require('vue-server-renderer')
const entryFile = require("../build/entryFile/getEntryFile")
let {serverConfigMap, clientConfigMap} = require("../build/multiPageWebPackConfig")
let fs = require("fs")
let promiseMap = {}
let rendererMap = {}
let setUpDevServer = require("../build/setup-dev-server")

//环境判断
const NODE_ENV = process.env.NODE_ENV

function createRenderer(bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
        // for component caching
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: path.resolve(__dirname, '../dist'),
        // recommended for performance
        runInNewContext: false,

    }))
}

function render({req, res, pageName}) {
    res.setHeader("Content-Type", "text/html")
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err)
        }
    }

    const context = {
        title: '标题', // default title
        url: req.url
    }

    console.log(pageName)

    rendererMap[pageName].renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }
        res.send(html)
    })
}

//根据不同的环境来生成renderer,开发环境根据setup-dev-server来生成
if (NODE_ENV === "development") {
    for (let pageName in entryFile.page) {
        promiseMap[pageName] = setUpDevServer({
            app: app,
            templatePath: baseTemplatePath,
            serverConfig: serverConfigMap[pageName],
            clientConfig: clientConfigMap[pageName],
            pageName: pageName,
            cb: function (bundle, options, pageName) {
                rendererMap[pageName] = createRenderer(bundle, options)
            }
        })

        //页面访问路由
        let route = "/" + entryFile.page[pageName].pathName
        app.get(route, (function (pageName) {
            return function (req, res) {
                promiseMap[pageName].then(() => {
                    render({req, res, pageName})
                })
            }
        })(pageName))
    }

}

//生产环境，读取buildConfig.json文件来生成
if (NODE_ENV === "production") {
    let buildConfig = require("../dist/buildConfig.json")

    for (let pageName in buildConfig) {
        let bundlePath = path.join(__dirname, "../dist/", buildConfig[pageName].serverBundle)
        let templatePath = path.join(__dirname, "../dist/", buildConfig[pageName].templatePath)
        let bundle = require(bundlePath, "utf-8")
        rendererMap[pageName] = createRenderer(bundle, {
            template: fs.readFileSync(templatePath, "utf-8")
        })

        //页面访问路由
        let route = "/" + entryFile.page[pageName].pathName
        app.get(route, ((pageName) => {
            return function (req, res) {
                return render({req, res, pageName})
            }
        })(pageName))
    }

    //静态文件
    let maxAge = 3600 * 1000 * 24 * 30  //静态文件缓存30填
    app.use("/public", express.static(path.join(__dirname, "../dist/public"),{
        maxAge: maxAge,
        setHeaders: function (res, path, stat) {
            //字体文件运行跨域
            if (/\.(ttf|woff|woff2|otf)$/.test(path)) {
                res.set("Access-Control-Allow-Origin", "*")
            }
        }
    }))
}

const port = process.env.PORT || 8081
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
