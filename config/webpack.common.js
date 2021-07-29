const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, '../')
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist')
const APP_PATH = path.resolve(ROOT_PATH, 'src')
const ENTRY_FILE = path.resolve(APP_PATH, 'app.module.ts')
const TEMPLATE_FILE = path.resolve(APP_PATH, 'app.module.html')

module.exports = {
    entry: {
        app: ENTRY_FILE,
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].[hash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: ''
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: false,
                parallel: true,
                exclude: /node_modules/,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: false
                },
                sourceMap: process.env.NODE_ENV == 'development'
            })
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                default: false,
                vendors: false
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: TEMPLATE_FILE,
            filename: BUILD_PATH.concat('/index.html'),
            alwaysWriteToDisk: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: '[name].css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        ident: 'postcss',
                        options: {
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                            ]
                        }
                    },
                    { loader: 'sass-loader' }
                ],
            },
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                    {
                        loader: 'tslint-loader',
                        options: {
                            configFile: ROOT_PATH.concat('/tslint.json')
                        }
                    }
                ],
                include: APP_PATH
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        exportAsEs6Default: true,
                        minimize: process.env.NODE_ENV == 'production',
                        removeComments: true
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/i,
                use: 'file-loader?name=assets/[name].[ext]'
            },
        ]
    }
}
