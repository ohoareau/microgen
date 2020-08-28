import {AbstractFileTemplate} from '@ohoareau/microgen';

export type CodeOfConductTemplateConfig = {
    code_of_conduct?: boolean,
};

export class CodeOfConductTemplate extends AbstractFileTemplate {
    private customConfig: CodeOfConductTemplateConfig ;
    private customConsumed: boolean;
    constructor(config: CodeOfConductTemplateConfig = {}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'CODE_OF_CONDUCT.md.ejs';
    }
    getVars() {
        if (!this.customConsumed) {
            this.customConsumed = true;
        }
        return {
            config: this.customConfig,
        }
    }
    isIgnored(): boolean {
        return false === this.customConfig.code_of_conduct;
    }
}

export default CodeOfConductTemplate