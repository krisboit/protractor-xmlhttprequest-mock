class XMLHttpRequestMock extends XMLHttpRequest {
    constructor() {
        super();
        this.mockedRequest = false;
        this.mock = null;
        this.hash = Math.floor(Math.random() * 1000);
        window.MockManager.allTraffic[this.hash] = {};
    }

    open(method, url, async, user, password) {
        if (async === undefined) {
            async = true;
        }

        window.MockManager.allTraffic[this.hash].method = method;
        window.MockManager.allTraffic[this.hash].url = url;

        super.open(method, url, async, user, password);
        let response = window.MockManager.getResponse(method, url);
        if (response) {
            this.mock = response;
            this.mockedRequest = true;
        }
    }

    send(data) {
        window.MockManager.allTraffic[this.hash].data = data;

        if (this.mockedRequest) {
            this.readyState = this.LOADING;
            if (this.onreadystatechange) this.onreadystatechange();

            this.responseText = this.mock.data;
            this.response = this.mock.data;
            this.status = this.mock.status;

            this.readyState = this.DONE;
            if (this.onreadystatechange) this.onreadystatechange();
            if (this.onload) this.onload();
            if (this.onloadend) this.onloadend();
            this.dispatchEvent(new Event('load'));

            return;
        }

        super.send(data);
    }

    getStatus() {
        return typeof this._status === 'number' ? this._status : super.status;
    }

    getResponse() {
        const response = this._response || super.response;
        window.MockManager.allTraffic[this.hash].response = response;
        return response;
    }

    getResponseText() {
        const responseText = this._responseText || super.responseText;
        window.MockManager.allTraffic[this.hash].responseText = responseText;
        return responseText;
    }

    getReadyState() {
        return this._readyState|| super.readyState;
    }
}

Object.defineProperty(XMLHttpRequestMock.prototype, 'status', {
    set:function(value){
        this._status = value;
    },
    get: function(){
        return this.getStatus()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'response', {
    set:function(value){
        this._response = value;
    },
    get: function(){
        return this.getResponse()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'responseText', {
    set:function(value){
        this._responseText = value;
    },
    get: function(){
        return this.getResponseText()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'readyState', {
    set:function(value){
        this._readyState = value;
    },
    get: function(){
        return this.getReadyState()
    }
});
