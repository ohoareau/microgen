import GenericTarget from './GenericTarget';

export abstract class AbstractTfenvTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandOptions(options: any): any {
        return {};
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `tfenv ${this.getCommandName(options)}`,
                [],
                this.getCommandOptions(options),
                options
            )
        ];
    }
}

export default AbstractTfenvTarget