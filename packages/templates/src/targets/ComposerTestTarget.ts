import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerTestTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'run-script';
    }
    getCommandArgs(options: any): any[] {
        return ['test'];
    }
}

export default ComposerTestTarget