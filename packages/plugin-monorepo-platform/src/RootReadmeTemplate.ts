import {ReadmeTemplate, ReadmeTemplateConfig} from "@ohoareau/microgen-templates-core";
import {buildProjectsVars} from "./utils";

export type project = {
    name: string,
    description: string,
    startable?: boolean,
    deployable?: boolean,
};

export type technology = {
    name: string,
    link?: string,
};

export type RootReadmeTemplateConfig = ReadmeTemplateConfig & {
    projects?: project[],
    project_prefix?: string,
    project_envs?: any[],
    technologies?: technology[],
};

export class RootReadmeTemplate extends ReadmeTemplate {
    constructor(config: RootReadmeTemplateConfig = {}) {
        super({project_prefix: 'xxxxxxxx', project_envs: [
                {name: 'dev', awsAccount: 'XXXXXXXXXXXX'},
                {name: 'test', awsAccount: 'XXXXXXXXXXXX'},
                {name: 'preprod', awsAccount: 'XXXXXXXXXXXX'},
                {name: 'prod', awsAccount: 'YYYYYYYYYYYY'},
            ], ...config, ...buildProjectsVars(config)});
        this
            .addNamedFragmentsFromTemplateDir(
                `${__dirname}/../templates/readme`,
                [
                    'introduction',
                    'team-commandments',
                    'pre-requisites',
                    'installation',
                    'development',
                    'appendices',
                ]
            )
        ;
    }
}

export default RootReadmeTemplate