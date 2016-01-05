/// <reference path="./node_modules/angular2/typings/es6-shim/es6-shim.d.ts"/>
/// <amd-dependency path="./test/integration/firebase.service.spec" />
/// <amd-dependency path="./test/unit/firebase.service.spec" />
/// <amd-dependency path="./test/unit/firebase-utils.spec" />
/// <reference path="./typings/sinon/sinon.d.ts"/>

declare var System;
declare var __karma__;
declare var Promise:PromiseConstructor;

var win = <any>window;

// Tun on full stack traces in errors to help debugging
(<any>Error).stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

__karma__.loaded = function () {
};

var baseURL = '/base/';
System.config({
    baseURL: baseURL,
    defaultJSExtensions: true,
    meta: {
        './node_modules/sinon/lib/*.js': {
            format: 'amd',
            exports: 'default'
        }
    },
    map: {
        'angular2': 'node_modules/angular2'
    },
    paths: {
        'rxjs/add/observable/*': 'node_modules/rxjs/add/observable/*.js',
        'rxjs/add/operator/*': 'node_modules/rxjs/add/operator/*.js',
        'rxjs/*': 'node_modules/rxjs/*.js',
        'sinon': 'node_modules/sinon/lib/sinon.js',
        'angular2-firebase/*': 'core.js'
    }
});

function onlySpecFiles(path) {
    return /^\/base\/test.+spec\.js$/.test(path);
}

// Import all the specs, execute their `main()` method and kick off Karma (Jasmine).
System.import('angular2/src/platform/browser/browser_adapter').then(function (browser_adapter) {
    (<any>browser_adapter).BrowserDomAdapter.makeCurrent();
}).then(function () {
        return Promise.all(
            Object.keys(win.__karma__.files) // All files served by Karma.
                .filter(onlySpecFiles)
                //.map(win.file2moduleName)        // Normalize paths to module names.
                .map(function (path) {
                    return System.import(path).then(function (module) {
                        if (module.hasOwnProperty('main')) {
                            module.main();
                        } else {
                            throw new Error('Module ' + path + ' does not implement main() method.');
                        }
                    });
                }));
    })
    .then(function () {
        __karma__.start();
    }, function (error) {
        __karma__.error(error.stack || error);
    });
