import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnLernaRunBuildTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'lerna run build';
    }
    getCommandOptions() {
        return {stream: true};
    }
}

export default YarnLernaRunBuildTarget