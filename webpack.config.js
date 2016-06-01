/// <reference path="./typings/node/node.d.ts" />

var webpack = require('webpack');

module.exports = {
    entry: {
        'ng2-firebase-all.umd': './core',
        'ng2-firebase-all.umd.min': './core'
    },
    output: {
        filename: '[name].js',
        path: 'bundles',
        library: 'ng2Firebase',
        libraryTarget: 'umd'
    },
    externals:
    //{
    //    "angular2/core": "ng.core",
    //    "rxjs/Rx": "Rx"
    //},
        [
            {
                "@angular/core": {
                    root: ["ng", "core"],
                    commonjs: ["@angular/core"],
                    amd: "@angular/core"
                },
                "rxjs/Rx": {
                    root: "Rx",
                    commonjs: "rxjs/Rx",
                    amd: "rxjs/Rx"
                }
            },
        //"angular2/core": "ng",
        //"rxjs/Rx": "Rx"

        // Every Non Relative Import is an
        // external dependency
        /^[a-zA-Z\-0-9\/]*$/
    ],
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};