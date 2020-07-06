import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitFullTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init-full';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerInitFullTarget