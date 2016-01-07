var webpack = require('webpack');

module.exports = {
    entry: {
        'firebase-angular2-all.umd': './core',
        'firebase-angular2-all.umd.min': './core'
    },
    output: {
        filename: '[name].js',
        path: 'bundles',
        library: 'firebaseAngular2',
        libraryTarget: 'umd'
    },
    externals:
    //{
    //    "angular2/core": "ng.core",
    //    "rxjs/Rx": "Rx"
    //},
        [
            {
                "angular2/core": {
                    root: ["ng", "core"],
                    commonjs: ["angular2/core"],
                    amd: "angular2/core"
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