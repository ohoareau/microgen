import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitFullUpgradeTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init-full-upgrade';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerInitFullUpgradeTarget