let express = require("express")
let app = express()
let path = require("path")
const LRU = require('lru-cache')
const baseTemplatePath = path.resolve(__dirname, '../src/template/index.template.html')
const {createBundleRenderer} = require('vue-server-renderer')
const entryFile = require("../build/entryFile/getEntryFile")
let {serverConfigMap, clientConfigMap} = require("../build/multiPageWebPackConfig")

let promiseMap = {}
let rendererMap = {}
let setUpDevServer = require("../build/setup-dev-server")
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
}

console.log(rendererMap)


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


    rendererMap[pageName].renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }
        res.send(html)
    })
}

for (let pageName in entryFile.page) {
    let route = "/" + entryFile.page[pageName].pathName
    console.log(route)
    app.get(route, (function (pageName) {
        return function (req, res) {
            promiseMap[pageName].then(() => {
                render({req, res, pageName})
            })
        }
    })(pageName))
}

const port = process.env.PORT || 8081
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
