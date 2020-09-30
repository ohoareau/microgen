import GenericTarget from './GenericTarget';

export abstract class AbstractYarnTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandOptions(options: any): any {
        return {
            ...(options.options || {}),
        }
    }
    getCommandEnvs(options: any): any {
        return {};
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `yarn --silent ${this.getCommandName(options)}`,
                [],
                this.getCommandOptions(options),
                options,
                {},
                [],
                [],
                this.getCommandEnvs(options),
            )
        ];
    }
}

export default AbstractYarnTarget