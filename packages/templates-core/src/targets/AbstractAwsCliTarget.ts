import GenericTarget from './GenericTarget';

export abstract class AbstractAwsCliTarget extends GenericTarget {
    buildOptions(options: any) {
        return {awsProfile: '$(AWS_PROFILE)', ...options};
    }
    abstract getServiceName(options: any): string;
    abstract getOperationName(options: any): string;
    getOperationOptions(options: any): any {
        return {};
    }
    getOperationArgs(options: any): string[] {
        return [];
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `aws ${this.getServiceName(options)} ${this.getOperationName(options)}`,
                this.getOperationArgs(options),
                this.getOperationOptions(options),
                options
            )
        ];
    }
}

export default AbstractAwsCliTarget