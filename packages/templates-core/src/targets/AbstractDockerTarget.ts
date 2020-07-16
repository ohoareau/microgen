import GenericTarget from './GenericTarget';
import {parseEcr} from "@ohoareau/aws-parse";

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
    getPreCommands(options: any): string[] {
        const pres = <string[]>[];
        if (options.awsEcrLogin) {
            const {region, domain} = parseEcr(options.tag);
            pres.push(`(aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${domain})`);
        }
        return pres;
    }

    getPostCommands(options: any): string[] {
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
                this.getPreCommands(options),
                this.getPostCommands(options),
            )
        ];
    }
}

export default AbstractDockerTarget