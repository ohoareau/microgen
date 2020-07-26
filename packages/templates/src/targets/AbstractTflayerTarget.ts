import GenericTarget from './GenericTarget';

export abstract class AbstractTflayerTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandOptions(options: any): any {
        return {};
    }
    getCommandArgs(options: any): string[] {
        return [];
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) ${this.getCommandName(options)}`,
                this.getCommandArgs(options),
                this.getCommandOptions(options),
                options
            )
        ];
    }
}

export default AbstractTflayerTarget