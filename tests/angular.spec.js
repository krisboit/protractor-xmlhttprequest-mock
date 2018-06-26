var MockService = require('../lib/mock-service').MockService;

function runAngularTests(angularVersion, url) {
    describe('Testing Angular '+ angularVersion +' app', function () {
        const ANGULAR_SAMPLE_APP_TITLE = 'Angular Sample app';
        const ANGULAR_MOCK_APP_TITLE = 'Angular Mock app';

        function loadPage() {
            return browser.get(url);
        }

        async function mockSampleJson(text) {
            if (!text) {
                text = 'Mock';
            }

            await MockService.addMock('sample-mock', {
                path: '/api/sample.json',
                response: {
                    status: 200,
                    data: JSON.stringify({response: text})
                }
            });
        }
        async function mockSampleRegexJson(text) {
            if (!text) {
                text = 'Mock';
            }

            await MockService.addMock('sample-mock', {
                path: /\/api\/[a-z]*.json/,
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

        it('should open page without mocks', async () => {
            await loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
        });

        it('should open page with happy case mocks', async () => {
            mockSampleJson();
            await loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
        });

        it('should open page with happy case mocks with Regex', async () => {
            mockSampleRegexJson();
            await loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
        });

        it('should reset mocks at page refresh', async () => {

            mockSampleJson();
            await loadPage();

            let text = await getPageTitleText();
            expect(text).toBe(ANGULAR_MOCK_APP_TITLE);
            loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
        });

        it('should be able to inject mock after page is loaded', async () => {
            await loadPage();

            let text = await getPageTitleText();
            expect(text).toBe(ANGULAR_SAMPLE_APP_TITLE);

            mockSampleJson();
            await clickRefreshButton();
            expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
        });

        it('should be able to overwrite a mock', async () => {
            mockSampleJson();
            await loadPage();

            let text = await getPageTitleText();
            expect(text).toBe(ANGULAR_MOCK_APP_TITLE);

            mockSampleJson('New Mock');
            await clickRefreshButton();
            expect(getPageTitleText()).toBe('Angular New Mock app');
        });

        it('should reset mocks when calling reset function', async () => {
            mockSampleJson();
            await loadPage();
            let text = await getPageTitleText();
            expect(text).toBe(ANGULAR_MOCK_APP_TITLE);

            MockService.reset();
            await clickRefreshButton();
            expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
        });

        it('should be able to reinject mock at page reload', async () => {
            mockSampleJson();
            await loadPage();
            let text = await getPageTitleText();
            expect(text).toBe(ANGULAR_MOCK_APP_TITLE);

            MockService.reset();
            mockSampleJson();
            await loadPage();
            expect(getPageTitleText()).toBe(ANGULAR_MOCK_APP_TITLE);
        });

        it('should be able to mock responses with other response code than 200', async () => {
            await MockService.addMock('sample-mock', {
                path: '/api/sample.json',
                response: {
                    status: 404,
                    data: {response: 'Error 404'}
                }
            });
            await loadPage();
            expect(getPageTitleText()).toBe('Angular Error 404 app');
            expect(browser.element(by.css('.response-code')).getText()).toBe('404');
        });

        it('should open the page after navigating to an external page', async () => {
            mockSampleJson();
            await loadPage();
            await browser.waitForAngularEnabled(false);
            await browser.element(by.css('.external-page-link')).click();
            browser.sleep(1000);

            await browser.element(by.css('#navigateTo')).clear().sendKeys('http://localhost:8080/angular');
            browser.sleep(1000);
            await browser.element(by.css('button')).click();

            await browser.waitForAngularEnabled(true);
            await browser.refresh();
            expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);

        });

        it('should open the page after navigating to a redirect page', async () => {
            mockSampleJson();
            await loadPage();
            await browser.waitForAngularEnabled(false);
            await browser.element(by.css('.redirect-page-link')).click();
            browser.sleep(1000);
            await browser.waitForAngularEnabled(true);
            expect(getPageTitleText()).toBe(ANGULAR_SAMPLE_APP_TITLE);
        });

        it('should allow you to set and use multiple mock response', async () => {
            const expectedFirstResponse = "First Response";
            const expectedSecondResponse = "Second Response";
            await MockService.addMocks('multi-mock', {
                path: '/api/sample.json',
                response: [{
                    status: 200,
                    data: JSON.stringify({response: expectedFirstResponse})
                }, {
                    status: 200,
                    data: JSON.stringify({response: expectedSecondResponse})
                }]
            });
            await loadPage();
            expect(getPageTitleText()).toBe(`Angular ${expectedFirstResponse} app`);
            await browser.element(by.css('button')).click();
            expect(getPageTitleText()).toBe(`Angular ${expectedSecondResponse} app`);
        });

        it('should use multi mock responses before using single mock responses', async () => {
            const multiMockResponse = "Multi mock response";
            await MockService.addMock('single-mock', {
                path: '/api/sample.json',
                response: {
                    status: 200,
                    data: JSON.stringify({response: "Single mock response"})
                }
            });
            await MockService.addMocks('multiple-mocks', {
                path: '/api/sample.json',
                response: [{
                    status: 200,
                    data: JSON.stringify({response: multiMockResponse})
                }]
            });
            await loadPage();
            expect(getPageTitleText()).toBe(`Angular ${multiMockResponse} app`);
        });

        it('should use single mock when there are no more multi mock responses', async() => {
            const singleMockResponse = "Single mock response";
            const multiMockResponse = "Multi mock response";
            await MockService.addMock('single-mock', {
                path: '/api/sample.json',
                response: {
                    status: 200,
                    data: JSON.stringify({response: singleMockResponse})
                }
            });
            await MockService.addMocks('multiple-mocks', {
                path: '/api/sample.json',
                response: [{
                    status: 200,
                    data: JSON.stringify({response: multiMockResponse})
                }]
            });
            await loadPage();
            expect(getPageTitleText()).toBe(`Angular ${multiMockResponse} app`);
            await browser.element(by.css('button')).click();
            expect(getPageTitleText()).toBe(`Angular ${singleMockResponse} app`);
        });

        //TODO: read mocks after navigating to external page
        //TODO: read mocks after navigating to a redirect page
    });
}

runAngularTests(1, 'http://localhost:8080/angularjs');
runAngularTests(2, 'http://localhost:8080/angular');
