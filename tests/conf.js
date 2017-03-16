exports.config = {
    directConnect: true,
    specs: [
        //'**/*.spec.js'
        'angular.spec.js'
    ],

    capabilities: {
        browserName: 'chrome',
        /**
         * If this is set to be true, specs will be sharded by file (i.e. all files to be run by this set of
         * capabilities will run in parallel).
         */
        shardTestFiles: true,
        /**
         * Maximum number of browser instances that can run in parallel for this set of capabilities.
         * This is only needed if shardTestFiles is true.
         */
        maxInstances: 2,
        chromeOptions: {
            args: ['--disable-web-security']
        }
    },

    onPrepare: function () {
        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

        jasmine.getEnv().addReporter(new SpecReporter({
            displayFailuresSummary: false,
            displayStacktrace: 'specs',
            displaySpecDuration: true
        }));
    },

    plugins: [{
       path: '../lib/index.js'
    }],

    framework: 'jasmine2',
    jasmineNodeOpts: {
        // If true, display spec names.
        isVerbose: true,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        ignoreSSL: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 120000 // 2 minutes
    }
};