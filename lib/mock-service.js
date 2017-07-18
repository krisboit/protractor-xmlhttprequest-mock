var fs = require('fs'),
    path = require('path');

var MockService = {
    reset: function() {
        if (this.browser) {
            this.browser.executeScript("window.MockManager.reset();");
        }
        this.browser = null;
        this.queue = [];
    },

    setup: function(browser) {
        this.browser = browser;

        // Inject browser scripts if needed
        return browser.executeScript('return typeof MockService == "undefined"')
        .then(function (needed) {
            if (needed) {
                var scripts = "";
                scripts += fs.readFileSync(path.join(
                    __dirname, './browser-scripts/XMLHttpRequestMock.js'), 'utf-8');
                scripts += fs.readFileSync(path.join(
                    __dirname, './browser-scripts/MockManager.js'), 'utf-8');

                browser.executeScript(scripts + 'MockManager.setup();');
            }

            if (this.queue) {
                //console.log('Execute scripts from queue: ');
                this.queue.forEach(function (script) {
                    //console.log(script);
                    this.browser.executeScript(script);
                });
                //console.log('DONE');
                this.queue = [];
            }
            this.browser.executeScript("if (window.bootApp) window.bootApp();");
        });
    },

    addMock: function(name, config) {
        if (!this.queue) {
            this.queue = [];
        }

        var script = "window.MockManager.addMock(\"" + name + "\", \"" + 
            JSON.stringify(config).replace(/\\/gi, "\\\\").replace(/"/gi, "\\\"") + 
            "\");";

        if (this.browser) {
            //console.log('Execute script in browser: ', script, this.browser);
            this.browser.executeScript(script);
        } else {
            //console.log('Put script in queue for execution: ', script);
            this.queue.push(script);
        }
        
    }
};

exports.MockService = MockService;