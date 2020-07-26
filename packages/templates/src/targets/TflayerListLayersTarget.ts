import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerListLayersTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'list-layers';
    }
}

export default TflayerListLayersTarget