import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnDeployTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'deploy';
    }
}

export default YarnDeployTarget