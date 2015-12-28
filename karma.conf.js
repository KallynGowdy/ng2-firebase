// Karma configuration
// Generated on Sun Dec 27 2015 17:39:57 GMT-0500 (Eastern Standard Time)
module.exports = function (config) {
    var customLaunchers = {
        'SL_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome'
        }
    };
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            // Sources and specs.
            // Loaded through the System loader, in `test-main.js`.
            { pattern: 'src/**', included: false },
            { pattern: 'node_modules/angular2/**', included: false, watched: false, served: true },
            { pattern: 'node_modules/rxjs/**', included: false, watched: false, served: true },
            { pattern: 'node_modules/sinon/**', included: false, watched: false, served: true },
            { pattern: 'node_modules/systemjs/dist/**', included: false, watched: false, served: true },
            // Node Modules
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'main-test.js',
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'PhantomJS'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        sauceLabs: {
            testName: 'angular2-firebase',
            customLaunchers: customLaunchers,
            browsers: Object.keys(customLaunchers),
            reporters: ['dots', 'saucelabs'],
            singleRun: true,
            username: 'KallynGowdy',
            accessKey: '56b7c708-318c-4d46-9611-5363755d5863',
            startConnect: false,
            connectOptions: {
                tunnelIdentifier: 'ebceb1217801488abd797b715c247a78'
            }
        }
    });
};
//# sourceMappingURL=karma.conf.js.map