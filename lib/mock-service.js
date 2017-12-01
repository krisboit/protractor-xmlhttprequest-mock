var fs = require('fs'),
    path = require('path');

var MockService = {
    reset: function() {
        return new Promise((resolve, reject) => {
            if (this.browser) {
                this.browser.executeScript("if(window.hasOwnProperty('MockManager')) window.MockManager.reset();")
                    .then(resolve);
                return;
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

        // Inject browser scripts if needed
        return browser.executeScript('return typeof MockManager == "undefined"')
        .then(function (needed) {
            var scripts = "";
            if (needed) {
                //console.log('injecting mock service!');
                scripts += fs.readFileSync(path.join(
                    __dirname, './browser-scripts/XMLHttpRequestMock.js'), 'utf-8');
                scripts += fs.readFileSync(path.join(
                    __dirname, './browser-scripts/MockManager.js'), 'utf-8');

                scripts += 'MockManager.setup();'
            }

            //console.log('check the queue', this.queue);
            if (self.queue) {
                //console.log('Execute scripts from queue: ');
                self.queue.forEach(function (script) {
                    scripts += script + ';';
                    //console.log(script);
                });
                //console.log('DONE');
                self.queue = [];
            }
            scripts += "if (window.bootApp) window.bootApp();";
            return browser.executeScript(scripts);
        });
    },

    addMock: function(name, config) {
        if (!this.queue) {
            this.queue = [];
        }

        var script = "window.MockManager.addMock(\"" + name + "\", \"" + 
            JSON.stringify(config).replace(/\\/gi, "\\\\").replace(/"/gi, "\\\"") + 
            "\");";

        //console.log('add mock browser instance', this.browser);
        if (this.browser) {
            //console.log('Execute script in browser: ', script, this.browser);
            return this.browser.executeScript(script);
        } else {
            //console.log('Put script in queue for execution: ', script);
            this.queue.push(script);
            return new Promise((resolve, reject) => resolve());
        }
        
    }
};

exports.MockService = MockService;
