import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerInitTarget