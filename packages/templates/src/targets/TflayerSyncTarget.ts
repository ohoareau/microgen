import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerSyncTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'sync';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerSyncTarget