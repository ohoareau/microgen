import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerPlanTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'plan';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerPlanTarget