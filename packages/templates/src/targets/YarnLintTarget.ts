import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnLintTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'lint';
    }
}

export default YarnLintTarget