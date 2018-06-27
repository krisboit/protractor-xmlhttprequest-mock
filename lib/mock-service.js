var fs = require('fs'),
    path = require('path');

function sanitiseConfig(config) {
    if (!(config.path instanceof RegExp)) {
        return;
    }

    config.path = {
        type: "RegExp",
        params: [
            config.path.toString()
        ]
    }
}

function stringifyConfig(config) {
    return JSON.stringify(config).replace(/\\/gi, "\\\\").replace(/"/gi, "\\\"");
}

var MockService = {
    reset: function() {
        return new Promise((resolve) => {
            if (this.browser) {
                this.browser
                    .executeScript("if(window.hasOwnProperty('MockManager')) window.MockManager.reset();")
                    .then(resolve);
            }
            this.browser = null;
            this.queue = [];
            resolve();
        });
    },

    setup: function(browser) {
        //console.log('running setup');
        this.browser = browser;
        var self = this;
        var scripts = "";

        // Inject browser scripts if needed
        return browser.executeScript('return typeof MockManager == "undefined"')
        .then(function (needed) {
            if (needed) {
                //console.log('injecting mock service!');
                scripts += fs.readFileSync(path.join(
                    __dirname, './browser-scripts/XMLHttpRequestMock.js'), 'utf-8');
                scripts += fs.readFileSync(path.join(
                    __dirname, './browser-scripts/MockManager.js'), 'utf-8');

                scripts += 'MockManager.setup();';
            }

            if (self.queue) {
                scripts += self.queue.join(';') + ';';
                self.queue = [];
            }
            scripts += 'if (window.bootApp) window.bootApp();';
            return browser.executeScript(scripts);
        });
    },

    addMock: function(name, config) {
        sanitiseConfig(config);
        var script = `window.MockManager.addMock("${name}", "${stringifyConfig(config)}");`;
        //console.log(script);
        return this.runScript(script);
    },

    addMocks: function(name, config) {
        sanitiseConfig(config);
        var script = `window.MockManager.addMocks("${name}", "${stringifyConfig(config)}");`;
        //console.log(script);
        return this.runScript(script);
    },

    runScript: function (script) {
        if (!this.queue) {
            this.queue = [];
        }
        //console.log('add mock browser instance', this.browser);
        if (this.browser) {
            return this.browser.executeScript(script);
        }
        this.queue.push(script);
        return Promise.resolve();
    },
};

exports.MockService = MockService;
