import GenericTarget from './GenericTarget';

export abstract class AbstractComposerTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandOptions(options: any): any {
        return {
            ...(options.options || {}),
        }
    }
    getCommandEnvs(options: any): any {
        return {};
    }
    getCommandArgs(options: any): any[] {
        return [];
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `composer -q -n --ansi ${this.getCommandName(options)}`,
                this.getCommandArgs(options),
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

export default AbstractComposerTarget