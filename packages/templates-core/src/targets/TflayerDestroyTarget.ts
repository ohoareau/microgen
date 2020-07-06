import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerDestroyTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'destroy';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerDestroyTarget