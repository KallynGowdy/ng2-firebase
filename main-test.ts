/// <reference path="node_modules/angular2/typings/es6-shim/es6-shim.d.ts"/>
declare var System:any;
declare var __karma__:any;
declare var Promise:PromiseConstructor;
declare var file2moduleName:any;
var hasKarma = typeof __karma__ !== 'undefined';
var baseURL = '';
if (hasKarma) {
    __karma__.loaded = function () {
    };
    baseURL = '/base/';
}
System.config({
    baseURL: baseURL,
    defaultJSExtensions: true,
    meta: {
        './node_modules/sinon/lib/*.js': {
            format: 'amd',
            exports: 'default'
        }
    },
    paths: {
        'rxjs/add/observable/*': 'node_modules/rxjs/add/observable/*.js',
        'rxjs/add/operator/*': 'node_modules/rxjs/add/operator/*.js',
        'rxjs/*': 'node_modules/rxjs/*.js',
        'sinon': 'node_modules/sinon/lib/sinon.js'
    }
});

var importPromise = System.import('src/all.spec');
if (hasKarma) {
    importPromise
        .then(function () {
            __karma__.start();
        })
        .catch(function (error) {
            __karma__.error(error.stack || error);
        });
}