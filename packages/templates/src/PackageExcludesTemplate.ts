import {AbstractFileTemplate} from '@ohoareau/microgen';

export type PackageExcludesTemplateConfig = {
};

export class PackageExcludesTemplate extends AbstractFileTemplate {
    private customConfig: PackageExcludesTemplateConfig ;
    private customConsumed: boolean;
    constructor(config: PackageExcludesTemplateConfig = {}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'package-excludes.lst.ejs';
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

export default PackageExcludesTemplate