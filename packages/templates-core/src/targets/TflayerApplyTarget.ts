import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerApplyTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'apply';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerApplyTarget