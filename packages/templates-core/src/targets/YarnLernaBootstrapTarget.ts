import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnLernaBootstrapTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'lerna bootstrap';
    }
    getCommandOptions({scope}) {
        return {scope};
    }
}

export default YarnLernaBootstrapTarget