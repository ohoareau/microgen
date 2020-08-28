import {AbstractFileTemplate} from '@ohoareau/microgen';

export type TerraformToVarsTemplateConfig = {
    envs_from_terraform?: {[key: string]: string},
};

export class TerraformToVarsTemplate extends AbstractFileTemplate {
    private readonly mapping: any;
    constructor(config: TerraformToVarsTemplateConfig = {}) {
        super();
        this.mapping = {...(config.envs_from_terraform || {})};
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'terraform-to-vars.json.ejs';
    }
    isIgnored() {
        return !this.mapping || (0 === Object.keys(this.mapping).length);
    }
    getVars() {
        return {
            mapping: this.mapping,
        }
    }
}

export default TerraformToVarsTemplate