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
        return <string[]>[];
    }

    getPostCommands(options: any): string[] {
        return <string[]>[];
    }
    buildPreCli(options: any): string[] {
        const pres = <string[]>[];
        if (options.awsEcrLogin) {
            let {region, domain} = parseEcr(options.tag);
            options.region && (region = options.region);
            options.domain && (domain = options.domain);
            pres.push(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${domain}`);
        }
        return pres;
    }
    buildPostCli(options: any): string[] {
        const posts = <string[]>[];
        if (options.awsEcrLogout) {
            let {domain} = parseEcr(options.tag);
            options.domain && (domain = options.domain);
            posts.push(`docker logout ${domain} 2>/dev/null || true`);
        }
        return posts;
    }
    buildSteps(options: any) {
        return [
            ...this.buildPreCli(options),
            this.buildCli(
                `docker ${this.getCommandName(options)}`,
                this.getCommandArgs(options),
                this.getCommandOptions(options),
                options,
                this.getCommandPreOptions(options),
                this.getPreCommands(options),
                this.getPostCommands(options),
            ),
            ...this.buildPostCli(options)
        ];
    }
}

export default AbstractDockerTarget