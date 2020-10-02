import GenericTarget from './GenericTarget';

export class CleanVendorTarget extends GenericTarget {
    buildSteps({on = undefined, vendorDir = 'vendor'}: {on?: string|string[], vendorDir?: string}) {
        return [
            `rm -rf ${vendorDir}/`,
        ];
    }
}

export default CleanVendorTarget