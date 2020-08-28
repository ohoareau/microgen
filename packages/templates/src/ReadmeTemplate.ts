import {AbstractFileTemplate} from '@ohoareau/microgen';

export type ReadmeTemplateConfig = {
    readme?: boolean,
    project_name?: string,
    name?: string,
};

export type FragmentConfigBase = {
    name?: string,
    type: string,
};

export type TemplateFragmentConfig = FragmentConfigBase & {
    type: 'template',
    template: string,
};

export type InlineFragmentConfig = FragmentConfigBase & {
    type: 'inline',
    content: string,
};

export type FragmentConfig = TemplateFragmentConfig | InlineFragmentConfig;

export class ReadmeTemplate extends AbstractFileTemplate {
    private customConfig: ReadmeTemplateConfig ;
    private customConsumed: boolean;
    private readonly fragments: any[];
    constructor(config: ReadmeTemplateConfig = {}) {
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
    addInlineFragment(content: string, name?: string): this {
        return this.addFragmentFromConfig({type: 'inline', content, name});
    }
    addTemplateFragment(template: string, name?: string): this {
        return this.addFragmentFromConfig({type: 'template', template, name});
    }
    addFragmentFromTemplate(template: string, name?: string): this {
        return this.addTemplateFragment(template, name);
    }
    addNamedFragmentFromTemplate(template: string, name: string): this {
        return this.addFragmentFromConfig({type: 'template', template, name})
    }
    addNamedFragmentsFromTemplateDir(dir: string, fragments: string[]): this {
        fragments.forEach(f => {
            this.addNamedFragmentFromTemplate(`${dir}/${f}.md.ejs`, f);
        });
        return this;
    }
    addFragmentFromConfig(fragment: FragmentConfig): this {
        this.fragments.push(fragment);
        return this;
    }
    isIgnored() {
        return false === this.customConfig.readme;
    }
    getVars() {
        if (!this.customConsumed) {
            this.customConsumed = true;
        }
        return {
            ...(this.customConfig || {}),
            name: this.customConfig.name || this.customConfig.project_name || 'myproject',
            fragments: this.fragments,
        }
    }
}

export default ReadmeTemplate