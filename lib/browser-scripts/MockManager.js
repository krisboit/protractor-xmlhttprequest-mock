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
        //console.log('aad mock', name, config);
        this.mocks.set(name, JSON.parse(config));
    }

    static getResponse(method, path) {
        let response = null;
        //console.log(this.mocks);
        this.mocks.forEach(function (config, name) {
            if (path.toLowerCase().match(new RegExp(config.path.toLowerCase()))) {
                if (!config.method || config.method && config.method.toLowerCase().match(new RegExp(method.toLowerCase()))) {
                    response = config.response;
                }
            }
        });

        return response;
    }
};