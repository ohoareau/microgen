import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnInstallProdTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'install';
    }
    getCommandOptions(options: any): any {
        return {prod: true};
    }
}

export default YarnInstallProdTarget