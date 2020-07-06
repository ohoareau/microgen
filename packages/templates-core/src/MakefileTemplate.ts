import {AbstractFileTemplate} from '@ohoareau/microgen';
import * as predefinedTargets from './targets';

export class MakefileTemplate extends AbstractFileTemplate {
    private targets: any[] = [];
    private globalVars: any[] = [];
    constructor() {
        super();
    }
    getTemplatePath() {
        return `${__dirname}/../templates`;
    }
    getName() {
        return 'Makefile.ejs';
    }
    getVars() {
        const nameSorter = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        const targetGroups = Object.entries(this.targets.reduce((acc, t) => {
            const groupName = this.buildTargetGroupName(t);
            if (!acc[groupName]) {
                acc[groupName] = {targets: []};
            }
            acc[groupName].targets.push(t);
            return acc;
        }, {})).map(([name, data]) => ({name, ...<any>data}));
        targetGroups.sort(nameSorter);
        targetGroups.forEach(g => {
            g.targets.sort(nameSorter);
        });
        const globalVars = this.globalVars.map(g => ({name: g.name, type: g.defaultValue ? '?=' : '=', value: g.defaultValue}));
        return {
            globalVars,
            targetGroups,
        }
    }
    addTarget(name, steps: string[] = [], dependencies: string[] = [], options: any = {}): this {
        return this.addPredefinedTarget(name, 'generic', options, steps, dependencies);
    }
    addMetaTarget(name, dependencies: string[] = [], options: any = {}): this {
        return this.addTarget(name, [], dependencies, options);
    }
    addSubTarget(name, dir: string, subName: string, extraVars: any = {}, dependencies: string[] = [], options: any = {}): this {
        return this.addTarget(name, [`${options.sourceEnvLocal ? `set -a && . ${dir}/.env.local && set +a && ` : ''}make -C ${dir}/ ${subName}${this.buildMakeVars(extraVars)}`], dependencies, options);
    }
    addGlobalVar(name: string, defaultValue: any = undefined): this {
        this.globalVars.push({name, defaultValue});
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