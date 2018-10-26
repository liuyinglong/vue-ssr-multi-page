## devtool

#### 模式选择

| 模式                    | 解释                                                         |
| ----------------------- | ------------------------------------------------------------ |
| eval                    | 每个module会封装到 eval 里包裹起来执行，并且会在末尾追加注释 `//@ sourceURL`. |
| source-map              | 生成一个**SourceMap**文件.                                   |
| hidden-source-map       | 和 source-map 一样，但不会在 bundle 末尾追加注释.            |
| inline-source-map       | 生成一个 **DataUrl** 形式的 SourceMap 文件.                  |
| eval-source-map         | 每个module会通过eval()来执行，并且生成一个DataUrl形式的SourceMap. |
| cheap-source-map        | 生成一个没有列信息（column-mappings）的SourceMaps文件，不包含loader的 sourcemap（譬如 babel 的 sourcemap） |
| cheap-module-source-map | 生成一个没有列信息（column-mappings）的SourceMaps文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。 |

> 关于source-map 可以看阮一峰 的 [JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.htmlhttp://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

#### 关于模式选择

开发环境推荐：

`cheap-module-eval-source-map`

生产环境推荐：

`cheap-module-source-map`

> 这也是下版本 webpack 使用 -d 命令启动 debug 模式时的默认选项

原因如下：

1. 使用 cheap 模式可以大幅提高 souremap 生成的效率。大部分情况我们调试并不关心列信息，而且就算 sourcemap 没有列，有些浏览器引擎（例如 v8） 也会给出列信息。
2. 使用 eval 方式可大幅提高持续构建效率。官方文档提供的速度对比表格可以看到 eval 模式的编译速度很快。
3. **使用 module 可支持 babel 这种预编译工具**（在 webpack 里做为 loader 使用）。
4. 使用 eval-source-map 模式可以减少网络请求。这种模式开启 DataUrl 本身包含完整 sourcemap 信息，并不需要像 sourceURL 那样，浏览器需要发送一个完整请求去获取 sourcemap 文件，这会略微提高点效率。而生产环境中则不宜用 eval，这样会让文件变得极大。

#### SourceMap模式效率对比图

![img](https://w5.sanwen8.cn/mmbiz_jpg/iaPE9DGZL2GicVAIrdwJx0Q38gXQYmzCA63BQicpuh077xk29kHMg3MFEkCaW3XD1wuIBpyexlX2X71kwBXGdVczQ/0?wx_fmt=jpeg) 