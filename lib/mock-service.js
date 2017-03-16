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
        if (this.queue) {
            //console.log('Execute scripts from queue: ');
            this.queue.forEach(function (script) {
                //console.log(script);
                this.browser.executeScript(script);
            });
            //console.log('DONE');
            this.browser.executeScript("if (window.bootApp) window.bootApp();");
            this.queue = [];
        }

        //console.log('setup()');
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