import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitUpgradeTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init-upgrade';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerInitUpgradeTarget