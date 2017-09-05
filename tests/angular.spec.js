var MockService = require('../lib/mock-service').MockService;

function runAngularTests(angularVersion, url) {
    describe('Testing Angular '+ angularVersion +' app', function () {
        const ANGULAR_SAMPLE_APP_TITLE = 'Angular Sample app';
        const ANGULAR_MOCK_APP_TITLE = 'Angular Mock app';

        function loadPage() {
            browser.get(url)
        }

        function mockSampleJson(text) {
            if (!text) {
                text = 'Mock';
            }

            MockService.addMock('sample-mock', {
                path: '/api/sample.json',
                response: {
                    status: 200,
                    data: JSON.stringify({response: text})
                }
            });
        }
        function mockSampleRegexJson(text) {
            if (!text) {
                text = 'Mock';
            }

            MockService.addMock('sample-mock', {
                path: /\/api\/[a-z].json/,
                response: {
                    status: 200,
                    data: JSON.stringify({response: text})
                }
            });
        }

        function clickRefreshButton() {
            return browser.element(by.css('.refresh-data')).click();
        }

        function getPageTitleText() {
            return browser.element(by.css('h2')).getText();
        }

        it('should open page without mocks', function () {
            loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
        });

        it('should open page with happy case mocks', function () {
            mockSampleJson();
            loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
        });

        it('should open page with happy case mocks with Regex', function () {
            mockSampleRegexJson();
            loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
        });

        it('should reset mocks at page refresh', function () {
            mockSampleJson();
            loadPage();
            getPageTitleText().then(function (text) {
                expect(text).toBe(ANGULAR_MOCK_APP_TITLE);
                loadPage();
                expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
            });
        });

        it('should be able to inject mock after page is loaded', function () {
            loadPage();
            getPageTitleText().then(function (text) {
                expect(text).toBe(ANGULAR_SAMPLE_APP_TITLE);
                mockSampleJson();
                clickRefreshButton().then(function () {
                    expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
                });
            });
        });

        it('should be able to overwrite a mock', function () {
            mockSampleJson();
            loadPage();
            getPageTitleText().then(function (text) {
                expect(text).toBe(ANGULAR_MOCK_APP_TITLE);

                mockSampleJson('New Mock');
                clickRefreshButton().then(function () {
                    expect(getPageTitleText()).toBe('Angular New Mock app');
                });
            });
        });

        it('should reset mocks when calling reset function', function () {
            mockSampleJson();
            loadPage();
            getPageTitleText().then(function (text) {
                expect(text).toBe(ANGULAR_MOCK_APP_TITLE);

                MockService.reset();
                clickRefreshButton().then(function () {
                    expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
                });
            });
        });

        it('should be able to reinject mock at page reload', function () {
            mockSampleJson();
            loadPage();
            getPageTitleText().then(function (text) {
                expect(text).toBe(ANGULAR_MOCK_APP_TITLE);

                MockService.reset();
                mockSampleJson();
                loadPage();
                expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);

            });
        });

        it('should be able to mock responses with other response code than 200', function () {
            MockService.addMock('sample-mock', {
                path: '/api/sample.json',
                response: {
                    status: 404,
                    data: {response: 'Error 404'}
                }
            });
            loadPage();
            expect(getPageTitleText()).toBe('Angular Error 404 app');
            expect(browser.element(by.css('.response-code')).getText()).toBe('404');
        });

    });
}

runAngularTests(1, 'http://localhost:8080/angularjs');
runAngularTests(2, 'http://localhost:8080/angular');
