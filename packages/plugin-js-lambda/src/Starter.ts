export type StarterConfig = {
    name: string,
    type: string,
    params: {[key: string]: any},
    vars: {[key: string]: any},
    directory: string,
    custom?: boolean,
};

export default class Starter {
    public readonly name: string;
    public readonly type: string;
    public readonly params: {[key: string]: any};
    public readonly vars: {[key: string]: any};
    public readonly directory: string;
    public readonly custom: boolean;
    constructor({name, type, params = {}, directory, custom = false, vars = {}}: StarterConfig) {
        this.name = name;
        this.type = type;
        this.params = {o: name, ...params};
        this.vars = vars;
        this.directory = directory;
        this.custom = !!custom;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const cfg = {templatePath: `${__dirname}/../templates`};
        if (this.custom) return {};
        const fnName = vars.fnName || `fn`;
        const offsetDir = this.directory ? this.directory.split('/').map(() => '..').join('/') : '.';
        const pre_init = () => '';
        const options = {};
        !!this.vars.paramsKey && (options['params'] = true);
        !!this.vars.rootDir && (options['rootDir'] = ('string' === typeof options['rootDir']) ? options['rootDir'] : `\`\${__dirname}${offsetDir !== '.' ? `/${offsetDir}` : ''}\``);
        const post_init = () => '';
        vars = {
            ...this.vars,
            ...this.params,
            pre_init,
            post_init,
            fnName,
            ...vars,
            directory: this.directory,
        };
        return {
            [`${this.directory ? `${this.directory}/` : ''}${this.name}.js`]: ({renderFile}) => renderFile(cfg)(`starters/${this.type}.js.ejs`, vars),
        };
    }
}