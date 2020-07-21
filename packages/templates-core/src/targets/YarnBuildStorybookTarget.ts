import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnBuildStorybookTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'build-storybook';
    }
}

export default YarnBuildStorybookTarget