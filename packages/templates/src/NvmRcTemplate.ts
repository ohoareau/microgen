import {AbstractFileTemplate} from '@ohoareau/microgen';

export type NvmRcTemplateConfig = {
};

export class NvmRcTemplate extends AbstractFileTemplate {
    private customConfig: NvmRcTemplateConfig ;
    private customConsumed: boolean;
    constructor(config: NvmRcTemplateConfig = {}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return '.nvmrc.ejs';
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

export default NvmRcTemplate