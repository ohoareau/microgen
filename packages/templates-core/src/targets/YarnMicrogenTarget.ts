import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnMicrogenTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'microgen';
    }
}

export default YarnMicrogenTarget