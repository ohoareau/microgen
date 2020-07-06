import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerRefreshTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'refresh';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerRefreshTarget