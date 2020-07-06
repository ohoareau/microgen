import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerSyncFullTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'sync-full';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerSyncFullTarget