
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
      mothod: 'get',
      response: {status: 418, data: "I'm a teapot"},
    });
    MockService.addMock('mock2', {
      path: '/api/teapot',
      mothod: 'post',
      response: {status: 401, data: "unauthorized"},
    });

    $('button').click();
    expect($('div').getText()).toEqual("I'm a teapot");
  });
});
```
Other examples can be found in `tests` folder.
