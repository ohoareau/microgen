import {AbstractFileTemplate} from '@ohoareau/microgen';

export type LicenseTemplateConfig = {
    license?: string|boolean,
    company?: string,
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
        const licenseStartYear = new Date().getFullYear();
        const licenseEndYear = new Date().getFullYear();
        const licensePeriod = (licenseEndYear === licenseStartYear) ? `${licenseEndYear}` : `${licenseStartYear} - ${licenseEndYear}`;
        return {
            license: this.customConfig.license || 'MIT',
            company: this.customConfig.company || undefined,
            licenseStartYear,
            licenseEndYear,
            licensePeriod,
        }
    }
}

export default LicenseTemplate