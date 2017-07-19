var MockService = require('./mock-service').MockService;

exports.onPageLoad = function () {
    MockService.setup(browser);
};

exports.postTest = function () {
    MockService.reset();
};

exports.MockService = MockService;