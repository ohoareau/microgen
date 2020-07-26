import {AbstractFileTemplate} from '@ohoareau/microgen';

export type ContributingTemplateConfig = {
};

export class ContributingTemplate extends AbstractFileTemplate {
    private customConfig: ContributingTemplateConfig ;
    private customConsumed: boolean;
    constructor(config: ContributingTemplateConfig = {}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'CONTRIBUTING.md.ejs';
    }
    getVars() {
        if (!this.customConsumed) {
            this.customConsumed = true;
        }
        return {
            config: this.customConfig,
        }
    }
}

export default ContributingTemplate