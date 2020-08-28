import {AbstractFileTemplate} from '@ohoareau/microgen';

export type LicenseTemplateConfig = {
    license?: string|boolean,
};

export class LicenseTemplate extends AbstractFileTemplate {
    private customConfig: LicenseTemplateConfig ;
    private customConsumed: boolean;
    constructor(config: LicenseTemplateConfig = {}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'LICENSE.md.ejs';
    }
    isIgnored() {
        return false === this.customConfig.license;
    }
    getVars() {
        if (!this.customConsumed) {
            this.customConsumed = true;
        }
        return {
            license: this.customConfig.license || 'MIT',
        }
    }
}

export default LicenseTemplate