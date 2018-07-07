import {ProtractorBrowser} from 'protractor';

export declare interface SimpleResponseMock {
    status: number,
    data: string
}

export declare interface ResponseMock {
    status: number,
    numberOfRequests: number,
    data: string
}

export declare interface MockConfig {
    path: string | RegExp,
    response: SimpleResponseMock | ResponseMock[]
}

export declare class MockService {
    static reset();
    static setup(browser: ProtractorBrowser);
    static addMock(name: string, config: MockConfig);
}
