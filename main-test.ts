/// <amd-dependency path="./test/integration/firebase.service.spec" />
/// <amd-dependency path="./test/unit/firebase.service.spec" />
/// <amd-dependency path="./test/unit/firebase-utils.spec" />
/// <reference path="./typings/sinon/sinon.d.ts"/>

declare var System;
declare var __karma__;
declare var Promise: PromiseConstructor;

var win = <any>window;

// Tun on full stack traces in errors to help debugging
//(<any>Error).stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

__karma__.loaded = function () {
};

var baseURL = '/base/';

var packages = {
    'angular2-firebase': { main: 'core.js', defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
    'sinon': { main: 'sinon.js', defaultExtension: 'js' }
};

var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'platform-browser',
    'platform-browser-dynamic'
];

// Add package entries for angular packages
ngPackageNames.forEach(function (pkgName) {
    packages['@angular/' + pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
});

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
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs',
        'sinon': 'node_modules/sinon/lib'
    },
    packages: packages
});

function onlySpecFiles(path) {
    return /^\/base\/test.+spec\.js$/.test(path);
}

// Import all the specs, execute their `main()` method and kick off Karma (Jasmine).
Promise.all(
    <any>Object.keys(win.__karma__.files) // All files served by Karma.
        .filter(onlySpecFiles)
        //.map(win.file2moduleName)        // Normalize paths to module names.
        .map(function (path) {
            return <any>System.import(path).then(function (module) {
                if (module.hasOwnProperty('main')) {
                    module.main();
                } else {
                    throw new Error('Module ' + path + ' does not implement main() method.');
                }
            });
        }))
    .then(function () {
        __karma__.start();
    }, function (error) {
        __karma__.error(error.stack || error);
    });
