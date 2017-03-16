var fs = require('fs'),
	path = require('path'),
    MockService = require('./mock-service').MockService;

// load scripts from files
var scripts = "";
scripts += fs.readFileSync(path.join(__dirname, './browser-scripts/XMLHttpRequestMock.js'), 'utf-8');
scripts += fs.readFileSync(path.join(__dirname, './browser-scripts/MockManager.js'), 'utf-8');

exports.onPageLoad = function () {
    // inject script in browser after page load
    //console.log('setup');
    browser.executeScript(
        scripts + "MockManager.setup();"
    );
    MockService.setup(browser);
};

exports.postTest = function () {
    MockService.reset();
};

exports.MockService = MockService;