import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnLernaPublishTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'lerna publish';
    }
}

export default YarnLernaPublishTarget