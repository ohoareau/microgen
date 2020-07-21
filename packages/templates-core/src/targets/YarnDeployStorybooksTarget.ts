import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnDeployStorybooksTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'deploy-storybooks';
    }
}

export default YarnDeployStorybooksTarget