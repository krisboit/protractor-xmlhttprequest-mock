# protractor-xmlhttprequest-mock
Ajax calls mocking plugin for protractor, will work with angular 2 also.

A simple example of usage:

```ts
import {browser, $} from 'protractor';
import {MockService} from 'protractor-xmlhttprequest-mock';

describe('the backend', () => {
  it('should reply with code 418', () => {
    MockService.setup(browser);
    MockService.addMock('mock1', {
      path: '/api/teapot',
      response: {status: 418, data: "I'm a teapot"},
    });

    $('button').click();
    expect($('div').getText()).toEqual("I'm a teapot");
  });
});
```

Other examples can be found in `tests` folder.
