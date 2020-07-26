import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerUpdateTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'update';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerUpdateTarget