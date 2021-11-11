const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');


module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'src/js/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定出口文件的路径目录
        // filename: 'bulid.js' // 制定出口文件的名称
        // path指定了本地构建地址，publicPath指定在浏览器中所引用的,指定的是构建后在html里的路径
        // publicPath: './',
        // 将入口文件重命名为带有20位的hash值的唯一文件
        filename: '[name].[hash].js' 
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/, // exclude 排除的意思，把 node_modules文件夹排除编译之外
                use: {
                    loader: 'babel-loader',
                    options: {
                        // presets 预设列表（一组插件）加载和使用
                        presets: ['env'],
                        plugins: ['transform-runtime'] // 加载和使用的插件列表
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        // 从 bundle 中提取文本（CSS）到单独的文件      
        new MiniCssExtractPlugin({
            //  提取css，并重名为带有 20位的hash值的唯一文件
            filename: '[name].[hash].css',
        }),
        new HtmlWebpackPlugin({
            title: '首页', // 用于生成的HTML文档的标题
            filename: 'index.html', //写入HTML的文件。默认为index.html。也可以指定一个子目录（例如：）assets/admin.html
            template: 'src/index.html' // Webpack需要模板的路径
                // template: 'index.ejs' // Webpack需要模板的路径
        }),
        // 需要结合webpack-dev-server 启用热替换模块(Hot Module Replacement)，也被称为 HMR
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        // contentBase: './dist', // 在 localhost:8080(默认) 下建立服务，将 dist 目录下的文件，作为可访问文件  contentBase：告诉服务器从哪里提供内容
        // 或者通过以下方式配置
        // contentBase: path.join(__dirname, "dist"),
        compress: true,
        // 当它被设置为true的时候对所有的服务器资源采用gzip压缩
        // 对JS，CSS资源的压缩率很高，可以极大得提高文件传输的速率，从而提升web性能
        port: 9000, // 如果想要改端口，可以通过 port更改
        hot: true, // 启用 webpack 的模块热替换特性()
        host: "localhost" // 如果你希望服务器外部可访问，指定使用一个 host。默认是 localhost(也就是你可以不写这个host这个配置属性)。
    }
}