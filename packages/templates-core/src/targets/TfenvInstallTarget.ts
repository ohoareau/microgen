import AbstractTfenvTarget from './AbstractTfenvTarget';

export class TfenvInstallTarget extends AbstractTfenvTarget {
    getCommandName() {
        return 'install';
    }
}

export default TfenvInstallTarget