import TestGroup from './TestGroup';

export type TestConfig = {
    name: string,
    type: string,
    config?: {[key: string]: any},
};

export default class Test {
    public readonly name: string;
    public readonly testGroup: TestGroup;
    public readonly type: string;
    public readonly config: {[key: string]: any};
    constructor(testGroup: TestGroup, {name, type, config = {}}: TestConfig) {
        this.name = name;
        this.testGroup = testGroup;
        this.type = type;
        this.config = config;
    }
}