import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnLernaChangedTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'lerna changed';
    }
}

export default YarnLernaChangedTarget