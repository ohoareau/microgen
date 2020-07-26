import GenericTarget from './GenericTarget';

export class CleanLibTarget extends GenericTarget {
    buildSteps({on = undefined, libDir = 'lib'}: {on?: string|string[], libDir?: string}) {
        const dirs: string[] = Array.isArray(on) ? on : (on ? [on] : []);
        return [
            ...(dirs.map(d => `find ${d}/ -name ${libDir} -type d -exec rm -rf {} +`)),
        ];
    }
}

export default CleanLibTarget