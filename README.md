
# protractor-xmlhttprequest-mock

[![Build Status](https://travis-ci.org/krisboit/protractor-xmlhttprequest-mock.svg?branch=master)](https://travis-ci.org/krisboit/protractor-xmlhttprequest-mock)

Ajax calls mocking plugin for protractor, will work with angular 2 also.

### A simple example of usage:

```ts
import {browser, $} from 'protractor';
import {MockService} from 'protractor-xmlhttprequest-mock';

describe('the backend', () => {
  it('should reply with code 418', async () => {
    await MockService.setup(browser);
    await MockService.addMock('mock1', {
      path: '/api/teapot',
      response: {status: 418, data: "I'm a teapot"},
    });

    expect($('div').getText()).toEqual("I'm a teapot");
  });
});
```
### Using regex:

```ts
import {browser, $} from 'protractor';
import {MockService} from 'protractor-xmlhttprequest-mock';

describe('the backend', () => {
  it('should reply with code 418', () => {
    MockService.setup(browser);
    MockService.addMock('mock1', {
      path: /^(\/api)\/teapot\/[1-9a-z]/,
      response: {status: 418, data: "I'm a teapot"},
    });

    $('button').click();
    expect($('div').getText()).toEqual("I'm a teapot");
  });
});
```

### Method support:
```ts
import {browser, $} from 'protractor';
import {MockService} from 'protractor-xmlhttprequest-mock';

describe('the backend', () => {
  it('should reply with code 418', () => {
    MockService.setup(browser);
    MockService.addMock('mock1', {
      path: '/api/teapot',
      method: 'get',
      response: {status: 418, data: "I'm a teapot"},
    });
    MockService.addMock('mock2', {
      path: '/api/teapot',
      method: 'post',
      response: {status: 401, data: "unauthorized"},
    });

    $('button').click();
    expect($('div').getText()).toEqual("I'm a teapot");
  });
});
```

### Multiple responses for a mock
```ts
import {browser, $} from 'protractor';
import {MockService} from 'protractor-xmlhttprequest-mock';

describe('the backend', () => {
  it('should reply with code 418', () => {
    MockService.setup(browser);
    MockService.addMock('mock1', {
      path: '/api/teapot',
      method: 'get',
      response: [
        {status: 418, numberOfRequests: 1, data: "I'm a teapot"},
        {status: 200, numberOfRequests: 2, data: "I'm not a teapot"},
        {status: 418, numberOfRequests: 1, data: "I'm a teapot again"}
        ],
    });
    MockService.addMock('mock2', {
      path: '/api/teapot',
      method: 'post',
      response: {status: 401, data: "unauthorized"},
    });

    $('button').click();
    expect($('div').getText()).toEqual("I'm a teapot");
  });
});
```
*****Note `numberOfRequests` is mandatory.**

Other examples can be found in the tests from  `tests` folder.
