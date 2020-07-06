import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnInstallTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'install';
    }
}

export default YarnInstallTarget