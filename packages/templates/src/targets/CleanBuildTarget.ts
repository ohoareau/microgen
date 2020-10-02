import GenericTarget from './GenericTarget';

export class CleanBuildTarget extends GenericTarget {
    buildSteps({on = undefined, buildDir = 'build'}: {on?: string|string[], buildDir?: string}) {
        return [
            `rm -rf ${buildDir}/`,
        ];
    }
}

export default CleanBuildTarget