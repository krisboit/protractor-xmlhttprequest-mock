//our root app component
import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpModule} from '@angular/http'
import {Http} from '@angular/http'

@Component({
    selector: 'my-app',
    template: `
    <div>
      <h2>Angular {{appType}} app</h2>
      <div><button (click)="getData()" class="refresh-data">Refresh data</button></div>
      <table>
        <tr>
            <td>Request status</td>
            <td>{{requestStatus}}</td>
        </tr>
        <tr>
            <td>Request url</td>
            <td>{{requestUrl}}</td>
        </tr>
        <tr>
            <td>Response code</td>
            <td class="response-code">{{responseCode}}</td>
        </tr>
        <tr>
            <td>Response data</td>
            <td>{{responseData | json}}</td>
        </tr>
      </table>
    </div>
  `,
})
export class App {
    requestStatus = "not started";
    requestUrl = "/api/sample.json";
    responseCode = "";
    responseData = "";

    appType = "";

    constructor(
        private http: Http
    ) {
        this.getData();
    }

    getData() {
        this.requestStatus = 'in progress';
        this.http.request(this.requestUrl, {method: 'get'}).subscribe((data) => {
            this.requestStatus = 'done';
            this.responseCode = data.status;
            this.responseData = data.json();
            this.appType = this.responseData.response;
        }, (data) => {
            this.requestStatus = 'done';
            this.responseCode = data.status;
            this.responseData = data.json();
            this.appType = this.responseData.response;
        });
    }
}

@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [App],
    bootstrap: [App]
})
export class AppModule {
}