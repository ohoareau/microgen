import AbstractDockerTarget from './AbstractDockerTarget';

export class DockerPushTarget extends AbstractDockerTarget {
    getCommandName() {
        return 'push';
    }
    getCommandArgs(options: any): string[] {
        return [
            options.tag,
        ];
    }
}

export default DockerPushTarget