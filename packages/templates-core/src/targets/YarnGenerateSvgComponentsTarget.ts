import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnGenerateSvgComponentsTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'generate-svg-components';
    }
}

export default YarnGenerateSvgComponentsTarget