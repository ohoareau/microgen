import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerGetTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'get';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerGetTarget