import GenericTarget from './GenericTarget';

export class PipInstallBuildUtilsTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `python3 -m pip install --upgrade pip`,
            `python3 -m pip install --upgrade setuptools wheel twine`,
        ];
    }
}

export default PipInstallBuildUtilsTarget