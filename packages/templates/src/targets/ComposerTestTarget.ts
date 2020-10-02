import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerTestTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'test';
    }
}

export default ComposerTestTarget