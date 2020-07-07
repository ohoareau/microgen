import {AbstractFileTemplate} from '@ohoareau/microgen';
import * as predefinedTargets from './targets';

export interface TargetConfigBase {
    name: string,
    steps?: string[],
    deps?: string[],
    options?: any,
}

export interface ShellTargetConfig extends TargetConfigBase {
    script: string,
}

export interface MetaTargetConfig extends TargetConfigBase {
}

export interface SubTargetConfig extends TargetConfigBase {
    dir: string,
    sub: string,
    vars?: any,
}

export interface PredefinedTargetConfig extends TargetConfigBase {
    type: string,
}

export type TargetConfig = ShellTargetConfig | MetaTargetConfig | SubTargetConfig | PredefinedTargetConfig;

export type GlobalVarConfig = {
    name: string,
    defaultValue?: any,
    value?: any,
};

export type MakefileTemplateConfig = {
    targets?: {[name: string]: Omit<ShellTargetConfig, 'name'> | Omit<MetaTargetConfig, 'name'> | Omit<SubTargetConfig, 'name'> | Omit<PredefinedTargetConfig, 'name'>},
    globals?: {[name: string]: Omit<GlobalVarConfig, 'name'>},
    defaultTarget?: string,
};

export class MakefileTemplate extends AbstractFileTemplate {
    private targets: any[] = [];
    private globalVars: any[] = [];
    private customConfig: MakefileTemplateConfig ;
    private customConsumed: boolean;
    constructor(config: MakefileTemplateConfig = {targets: {}, globals: {}}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
        config.defaultTarget && this.setDefaultTarget(config.defaultTarget);
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'Makefile.ejs';
    }
    addTargetFromConfig(config: TargetConfig): this {
        switch (true) {
            case (config as ShellTargetConfig).script !== undefined:
                const c0: ShellTargetConfig = <ShellTargetConfig>config;
                return this.addShellTarget(c0.name, c0.script, c0.deps, c0.options);
            case (config as SubTargetConfig).sub !== undefined:
                const c1: SubTargetConfig = <SubTargetConfig>config;
                return this.addSubTarget(c1.name, c1.dir, c1.sub, c1.vars, c1.deps, c1.options);
            case (config as PredefinedTargetConfig).type !== undefined:
                const c2: PredefinedTargetConfig = <PredefinedTargetConfig>config;
                return this.addPredefinedTarget(c2.name, c2.type, c2.options, c2.steps, c2.deps);
            case (config as MetaTargetConfig).deps !== undefined:
                const c3: MetaTargetConfig = <MetaTargetConfig>config;
                return this.addMetaTarget(c3.name, c3.deps, c3.options);
            default:
                return this.addTarget(config.name, config.steps, config.deps, config.options);
        }
    }
    addGlobalVarFromConfig(config: GlobalVarConfig): this {
        return this.addGlobalVar(config.name, config.defaultValue, config.value);
    }
    getVars() {
        if (!this.customConsumed) {
            Object.entries(this.customConfig.targets || {}).forEach(([name, targetConfig]) => {
                this.addTargetFromConfig({name, ...targetConfig});
            });
            Object.entries(this.customConfig.globals || {}).forEach(([name, globalVarConfig]) => {
                this.addGlobalVarFromConfig({name, ...globalVarConfig});
            });
            this.customConsumed = true;
        }
        const nameSorter = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        const targetGroups = Object.entries(this.targets.reduce((acc, t) => {
            const groupName = this.buildTargetGroupName(t);
            if (!acc[groupName]) {
                acc[groupName] = {targets: {}};
            }
            acc[groupName].targets[t.name] = t;
            return acc;
        }, {})).map(([name, data]) => ({name, ...<any>data}));
        targetGroups.sort(nameSorter);
        targetGroups.forEach(g => {
            g.targets = Object.values(g.targets);
            g.targets.sort(nameSorter);
        });
        const globalVars = Object.values(this.globalVars.reduce((acc, v) => Object.assign(acc, {[v.name]: v}), {})).map((g: any) => ({name: g.name, type: g.defaultValue ? '?=' : '=', value: g.value || g.defaultValue}));
        return {
            globalVars,
            targetGroups,
        }
    }
    addTarget(name, steps: string[] = [], dependencies: string[] = [], options: any = {}): this {
        return this.addPredefinedTarget(name, 'generic', options, steps, dependencies);
    }
    addShellTarget(name, script, dependencies: string[] = [], options: any = {}): this {
        return this.addTarget(name, [`sh ${script}`], dependencies, options);
    }
    addMetaTarget(name, dependencies: string[] = [], options: any = {}): this {
        return this.addTarget(name, [], dependencies, options);
    }
    addSubTarget(name, dir: string, subName: string, extraVars: any = {}, dependencies: string[] = [], options: any = {}): this {
        return this.addTarget(name, [`${options.sourceEnvLocal ? `set -a && . ${dir}/.env.local && set +a && ` : ''}make -C ${dir}/ ${subName}${this.buildMakeVars(extraVars)}`], dependencies, options);
    }
    addGlobalVar(name: string, defaultValue: any = undefined, value: any = undefined): this {
        this.globalVars.push({name, defaultValue, value});
        return this;
    }
    addPredefinedTarget(name: string, type?: string, options: any = {}, extraSteps: string[] = [], extraDependencies: string[] = []): this {
        const tName = `${(type || name).split(/-/g).map(t => `${t.slice(0, 1).toUpperCase()}${t.slice(1)}`).join('')}Target`;
        if (!predefinedTargets[tName]) throw new Error(`Unknown predefined target with name ${type || name}`);
        this.targets.push(new predefinedTargets[tName]({name, steps: extraSteps, dependencies: extraDependencies, options}));
        return this;
    }
    setDefaultTarget(name) {
        this.addTarget('all', [], [name]);
        return this;
    }
    buildTargetGroupName(target): string {
        return target.name.split('-').slice(0, 1);
    }
    buildMakeVars(vars: any) {
        const t = Object.entries(vars).reduce((acc, [k, v]) => {
            return `${acc || ''}${acc ? ' ' : ''}${k}=${v}`;
        }, '');
        return `${t ? ' ' : ''}${t || ''}`;
    }
}

export default MakefileTemplate