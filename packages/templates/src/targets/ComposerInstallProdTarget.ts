import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerInstallProdTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'install';
    }
    getCommandOptions(options: any): any {
        return {prod: true};
    }
}

export default ComposerInstallProdTarget