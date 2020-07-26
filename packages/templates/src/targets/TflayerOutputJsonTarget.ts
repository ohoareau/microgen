import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerOutputJsonTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'output-json';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerOutputJsonTarget