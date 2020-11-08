import Handler from './Handler';
import MicroserviceType from './MicroserviceType';
import Package from './Package';

export type MicroserviceConfig = {
    name: string,
    types?: any,
    handlers?: any,
};

export default class Microservice {
    public readonly name: string;
    public readonly types: {[key: string]: MicroserviceType} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly package: Package;
    constructor(pkg: Package, {name, types = {}, handlers = {}}: MicroserviceConfig) {
        this.package = pkg;
        this.name = name;
        Object.entries(types).forEach(
            ([name, c]: [string, any]) => {
                c = this.package.configEnhancer.enrichConfigType({...((null === c || undefined === c || !c) ? {} : (('string' === typeof c) ? {type: c} : c))});
                this.types[name] = new MicroserviceType(this, {
                    microservice: this,
                    name,
                    ...c,
                });
            }
        );
        const opNames = Object.entries(this.types).reduce((acc, [n, t]) =>
            Object.keys(t.operations).reduce((acc2, n2) => {
                acc2.push(`${n}_${n2}`);
                return acc2;
            }, acc)
        , <string[]>[]);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) =>
                this.handlers[name] = new Handler({name: `${this.name}${'handler' === name ? '' : `_${name}`}`, ...c, directory: 'handlers', vars: {...(c.vars || {}), operations: opNames, prefix: this.name}})
        );
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        return (await Promise.all(Object.values(this.types).map(
            async o => o.generate(vars)))).reduce((acc, r) =>
                Object.assign(acc, r),
            (await Promise.all(Object.values(this.handlers).map(async h => h.generate(vars)))).reduce((acc, ff) => Object.assign(acc, ff), {})
        );
    }
}