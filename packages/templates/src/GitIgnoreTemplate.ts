import {AbstractFileTemplate} from '@ohoareau/microgen';

export type GitIgnoreTemplateConfig = {
    ignores?: (string|ignore)[],
    groups?: group[],
};

export type ignore = {
    path: string,
} ;

export type group = {
    name: string,
    ignores?: (string|ignore)[],
};

export class GitIgnoreTemplate extends AbstractFileTemplate {
    private customConfig: GitIgnoreTemplateConfig ;
    private customConsumed: boolean;
    private groups: group[];
    constructor(config: GitIgnoreTemplateConfig = {}) {
        super();
        this.groups = [];
        this.customConsumed = false;
        this.customConfig = config;
    }
    addIgnoreFromConfig(config: string|ignore, group?: string): this {
        const realConfig: ignore = 'string' === typeof config ? {path: config} : config;
        return this.addIgnore(realConfig.path, group);
    }
    addGroupFromConfig(config: group): this {
        return this.addGroup(config.name, config.ignores || []);
    }
    addComment(comment: string): this {
        return this.addGroup(comment);
    }
    addGroup(name: string, ignores?: (string|ignore)[]): this {
        this.groups.push(this.createGroup(name, (ignores || []).map(ignore => 'string' === typeof ignore ? this.createIgnore(ignore) : ignore)));
        return this;
    }
    addIgnore(path, group?: string): this {
        const realGroup = group ? group : '@';
        const eg: group|undefined = this.groups.find(g => g.name === realGroup);
        let g: group;
        if (!eg) {
            g = this.createGroup(realGroup)
            this.groups.push(g);
        } else {
            g = eg;
        }
        g.ignores = g.ignores || [];
        g.ignores.push({path});
        return this;
    }
    addNonIgnore(path, group?: string): this {
        return this.addIgnore(`!${path}`, group);
    }
    createGroup(name: string, ignores: (string|ignore)[] = []): group {
        return {name, ignores};
    }
    createIgnore(path: string): ignore {
        return {path};
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return '.gitignore.ejs';
    }
    getVars() {
        if (!this.customConsumed) {
            (this.customConfig.ignores || []).forEach(ignore => this.addIgnoreFromConfig(ignore));
            (this.customConfig.groups || []).forEach(group => this.addGroupFromConfig(group))
            this.customConsumed = true;
        }
        return {
            groups: this.groups,
        }
    }
}

export default GitIgnoreTemplate