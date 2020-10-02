import GenericTarget from './GenericTarget';

export class CleanWebBundlesTarget extends GenericTarget {
    buildSteps({on = undefined, webBundlesDir = 'web/bundles'}: {on?: string|string[], webBundlesDir?: string}) {
        return [
            `rm -rf ${webBundlesDir}/`,
        ];
    }
}

export default CleanWebBundlesTarget