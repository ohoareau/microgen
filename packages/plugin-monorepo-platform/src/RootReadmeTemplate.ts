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
    technologies?: technology[],
};

export class RootReadmeTemplate extends ReadmeTemplate {
    constructor(config: RootReadmeTemplateConfig = {}) {
        super({...config, ...buildProjectsVars(config)});
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