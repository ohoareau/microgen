import TestGroup, {TestGroupConfig} from './TestGroup';

export type TestFileConfig = {
    mocks?: string[],
    groups?: {[key: string]: TestGroupConfig},
};

export default class TestFile {
    public readonly mocks: string[];
    public readonly groups: TestGroup[];
    constructor({mocks = [], groups = {}}: TestFileConfig) {
        this.mocks = mocks;
        this.groups = Object.entries(groups).reduce((acc, [k, v]) => {
            acc.push(new TestGroup({name: k, ...v}));
            return acc;
        }, <TestGroup[]>[]);
    }
    hasTests(): boolean {
        return this.groups.reduce((acc: boolean, g: TestGroup) => acc || g.hasTests(), false);
    }
}