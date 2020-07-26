import GenericTarget from './GenericTarget';

export class VirtualenvCreateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `virtualenv venv`,
        ];
    }
}

export default VirtualenvCreateTarget