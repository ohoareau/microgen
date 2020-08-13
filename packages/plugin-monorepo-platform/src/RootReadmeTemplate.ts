import {ReadmeTemplate, ReadmeTemplateConfig} from "@ohoareau/microgen-templates";
import {
    buildInstallProceduresVars,
    buildPreRequisitesVars,
    buildProjectEnvsVars,
    buildProjectsVars,
    buildTechnologiesVars
} from "./utils";

export type project = {
    id: string,
    name?: string,
    description: string,
    startable?: boolean,
    deployable?: boolean,
    buildable?: boolean,
    cleanable?: boolean,
    generateEnvLocalable?: boolean,
    installable?: boolean,
    preInstallable?: boolean,
    refreshable?: boolean,
    servable?: boolean,
    testable?: boolean,
    validatable?: boolean,
};

export type technology = {
    id: string,
    name?: string,
    link?: string,
};

export type RootReadmeTemplateConfig = ReadmeTemplateConfig & {
    projects?: {[id: string]: Omit<project, 'id'>},
    project_prefix?: string,
    project_envs?: any,
    technologies?: {[id: string]: Omit<technology, 'id'>},
    preRequisites?: {[id: string]: any},
    installProcedures?: {[id: string]: any},
};

export class RootReadmeTemplate extends ReadmeTemplate {
    constructor(config: RootReadmeTemplateConfig = {}) {
        const x = {
            project_prefix: 'xxxxxxxx',
            project_envs: {
                dev: {awsAccount: 'XXXXXXXXXXXX', priority: 1},
                test: {awsAccount: 'XXXXXXXXXXXX', priority: 2},
                preprod: {awsAccount: 'XXXXXXXXXXXX', priority: 3},
                prod: {awsAccount: 'YYYYYYYYYYYY', priority: 4},
            },
            ...config,
        }
        super({
            ...x,
            ...buildProjectsVars(x),
            ...buildTechnologiesVars(x),
            ...buildPreRequisitesVars(x),
            ...buildInstallProceduresVars(x),
            ...buildProjectEnvsVars(x),
        });
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