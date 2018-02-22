var MockService = require('./mock-service').MockService;

exports.onPageLoad = function () {
    return MockService.setup(browser);
};

exports.postTest = function () {
    return MockService.reset();
};

exports.MockService = MockService;