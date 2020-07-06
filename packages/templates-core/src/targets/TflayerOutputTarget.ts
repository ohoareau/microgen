import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerOutputTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'output';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerOutputTarget