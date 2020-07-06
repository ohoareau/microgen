import GenericTarget from './GenericTarget';

export class CleanTsBuildInfoTarget extends GenericTarget {
    buildSteps({on = undefined, tsBuildInfoFile = 'tsconfig.tsbuildinfo'}: {on?: string|string[], tsBuildInfoFile?: string}) {
        const dirs: string[] = Array.isArray(on) ? on : (on ? [on] : []);
        return [
            ...(dirs.map(d => `find ${d}/ -name ${tsBuildInfoFile} -exec rm -rf {} +`)),
        ];
    }
}

export default CleanTsBuildInfoTarget