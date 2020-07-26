import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnStoryTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'story';
    }
}

export default YarnStoryTarget