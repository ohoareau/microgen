import Test, {TestConfig} from './Test';

export type TestGroupConfig = {
    name: string,
    tests?: TestConfig[]
};

export default class TestGroup {
    public readonly name: string;
    public readonly tests: Test[];
    constructor({name, tests = []}: TestGroupConfig) {
        this.name = name;
        this.tests = tests.reduce((acc, t) => {
            acc.push(new Test(this, t));
            return acc;
        }, <Test[]>[]);
    }
    hasTests(): boolean {
        return !!this.tests.length;
    }
}