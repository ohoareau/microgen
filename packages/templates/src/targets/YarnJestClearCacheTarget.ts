import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnJestClearCacheTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'jest';
    }
    getCommandOptions() {
        return {clearCache: true};
    }
}

export default YarnJestClearCacheTarget