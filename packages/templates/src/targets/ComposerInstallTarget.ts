import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerInstallTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'install';
    }
}

export default ComposerInstallTarget