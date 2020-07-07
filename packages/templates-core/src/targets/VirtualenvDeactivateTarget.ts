import GenericTarget from './GenericTarget';

export class VirtualenvDeactivateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `deactivate`,
        ];
    }
}

export default VirtualenvDeactivateTarget