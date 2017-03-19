import {ProtractorBrowser} from 'protractor';

export declare interface MockConfig {
    path: string,
    response: {
        status: number,
        data: string
    }
}

export declare class MockService {
    static reset();
    static setup(browser: ProtractorBrowser);
    static addMock(name: string, config: MockConfig);
}