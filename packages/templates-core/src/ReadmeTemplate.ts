import {AbstractFileTemplate} from '@ohoareau/microgen';

export type ReadmeTemplateConfig = {
    project_name?: string,
    name?: string,
};

export class ReadmeTemplate extends AbstractFileTemplate {
    private customConfig: ReadmeTemplateConfig ;
    private customConsumed: boolean;
    private readonly fragments: any[];
    constructor(config: ReadmeTemplateConfig) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
        this.fragments = <any[]>[];
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'README.md.ejs';
    }
    addFragmentFromTemplate(template: string): this {
        this.fragments.push({type: 'template', template});
        return this;
    }
    getVars() {
        if (!this.customConsumed) {
            this.customConsumed = true;
        }
        return {
            project_name: this.customConfig.project_name || this.customConfig.name || 'myproject',
            fragments: this.fragments,
        }
    }
}

export default ReadmeTemplate