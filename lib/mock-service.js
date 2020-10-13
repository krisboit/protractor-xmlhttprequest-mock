var fs = require('fs'),
    path = require('path');

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
        if (!this.queue) {
            this.queue = [];
        }

        if (config.path instanceof RegExp) {
            // serialize regexp to be json friendly
            config.path = {
                type: "RegExp",
                params: [
                    config.path.toString()
                ]
            }
        }

        var script = "window.MockManager.addMock(\"" + name + "\", \"" + 
            JSON.stringify(config).replace(/\\/gi, "\\\\").replace(/"/gi, "\\\"") + 
            "\");";
        //console.log(script);

        //console.log('add mock browser instance', this.browser);
        if (this.browser) {
            //console.log('Execute script in browser: ', script, this.browser);
            return this.browser.executeScript(script);
        } else {
            //console.log('Put script in queue for execution: ', script);
            this.queue.push(script);
            return Promise.resolve();
        }   
    },

    getNetworkTraffic: function() {
        return browser.executeScript('return window.MockManager.allTraffic;');
    },

    resetNetworkTraffic: function () {
        return browser.executeScript('window.MockManager.resetTraffic();');
    }
};

exports.MockService = MockService;
