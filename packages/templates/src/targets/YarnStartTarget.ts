import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnStartTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'start';
    }
}

export default YarnStartTarget