import AbstractDockerTarget from './AbstractDockerTarget';

export class DockerTagTarget extends AbstractDockerTarget {
    getCommandName() {
        return 'tag';
    }
    getCommandArgs(options: any): string[] {
        return [
            options.tag,
            options.remoteTag,
        ];
    }
}

export default DockerTagTarget