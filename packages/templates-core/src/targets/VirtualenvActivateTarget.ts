import GenericTarget from './GenericTarget';

export class VirtualenvActivateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `. venv/bin/activate`,
        ];
    }
}

export default VirtualenvActivateTarget