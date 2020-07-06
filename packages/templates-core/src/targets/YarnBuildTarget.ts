import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnBuildTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'build';
    }
}

export default YarnBuildTarget