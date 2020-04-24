import IPackage from './IPackage';
import IPlugin, {PluginConfig} from './IPlugin';

export type GeneratorConfig = {
    rootDir: string,
    vars?: any,
    plugins?: (PluginConfig|string)[],
    packages?: {[key: string]: any},
};

export interface IGenerator {
    getRootDir(): string;
    registerPlugin(plugin: IPlugin);
    registerPluginFromConfig(plugin: PluginConfig);
    registerPackager(type: string, packager: (config: any) => IPackage);
    generate(vars: any): Promise<{[key: string]: Function}>;
    getVars(): {[key: string]: any};
    setVar(key: string, value: any);
}

export default IGenerator