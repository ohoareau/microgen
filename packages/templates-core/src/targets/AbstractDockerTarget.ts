import GenericTarget from './GenericTarget';

export abstract class AbstractDockerTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandOptions(options: any): any {
        return {};
    }
    getCommandPreOptions(options: any): any {
        return {};
    }
    getCommandArgs(options: any): string[] {
        return <string[]>[];
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `docker ${this.getCommandName(options)}`,
                this.getCommandArgs(options),
                this.getCommandOptions(options),
                options,
                this.getCommandPreOptions(options),
            )
        ];
    }
}

export default AbstractDockerTarget