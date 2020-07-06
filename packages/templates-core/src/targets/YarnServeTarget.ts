import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnServeTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'serve';
    }
}

export default YarnServeTarget