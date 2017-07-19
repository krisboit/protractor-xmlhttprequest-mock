//main entry point
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app';

var isTesting = /^NG_DEFER_BOOTSTRAP!/.test(window.name);
var bootApp = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
};
if (!isTesting) {
    bootApp();
} else {
    // setting application boot function on window for protractor
    (<any>window).bootApp = bootApp;
}
console.log('Boot app');
platformBrowserDynamic().bootstrapModule(AppModule);

