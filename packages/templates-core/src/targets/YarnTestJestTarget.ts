import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnTestJestTarget extends AbstractYarnTarget {
    getCommandName(options: any): string {
        return 'test';
    }
    getCommandOptions({all, ci, color, coverage, local, parallel = true}): any {
        return {
            all: (!local || (all === true)) || undefined,
            color: (!local || (color === true)) || undefined,
            runInBand: !parallel || undefined,
            coverage: ((ci || coverage || local) && (false !== coverage)) || undefined,
            detectOpenHandles: true,
        }
    }
}

export default YarnTestJestTarget