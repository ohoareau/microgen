import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerUpdateTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'update';
    }
}

export default ComposerUpdateTarget