class MockManager {

    static setup() {
        window.XMLHttpRequestMock = XMLHttpRequestMock;
        window.XMLHttpRequestOriginal = window.XMLHttpRequest;
        window.XMLHttpRequest = window.XMLHttpRequestMock;
        window.MockManager = MockManager;
        this.mocks = new Map();
        //console.log('mockManager.setup()');
    }

    static tearDown() {
        window.XMLHttpRequest = window.XMLHttpRequestOriginal;
    }

    static reset() {
        this.mocks = new Map();
    }

    static addMock(name, config) {
        config = JSON.parse(config);
        if (config && config.path && config.path.type) {
            switch(config.path.type) {
                case "RegExp":
                    var m = config.path.params[0].match(/\/(.*)\/(.*)?/);
                    config.path = new RegExp(m[1], m[2] || "");
                    break;
            }
        }
        console.log('aad mock', name, config);
        this.mocks.set(name, config);
    }

    static getResponse(method, path) {
        let response = null;
        //console.log(this.mocks);
        this.mocks.forEach(function (config, name) {
            let configPath  = config.path instanceof RegExp ? config.path : new RegExp(config.path,'i');
            if (path.match(configPath)) {
                if (!config.method || config.method && config.method.match(new RegExp(method,'i'))) {
                    console.log("Return mock for", path, configPath, config.response);
                    response = config.response;
                }
            }
        });

        return response;
    }
};
