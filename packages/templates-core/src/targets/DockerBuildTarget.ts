import AbstractDockerTarget from './AbstractDockerTarget';

export class DockerBuildTarget extends AbstractDockerTarget {
    getCommandName() {
        return 'build';
    }
    getCommandPreOptions(options: any): any {
        return {
            't': options.tag || undefined,
            ['build-arg']: Object.entries(options.buildArgs || {}).reduce((acc, [k, v]) => {
                acc.push(`${k}=${v}`);
                return acc;
            }, <string[]>[]),
        }
    }

    getCommandArgs(options: any): string[] {
        return [
            options.path || '.'
        ];
    }
}

export default DockerBuildTarget