import IPackage from './IPackage';
import IPlugin, {PluginConfig} from './IPlugin';
import IRegistry from './IRegistry';

export interface IGenerator {
    getRootDir(): string;
    registerPlugin(plugin: IPlugin);
    registerRegistryFactory(type: string|string[], registry: (config: any) => IRegistry);
    registerRegistry(type: string|string[], config: any);
    registerPluginFromConfig(plugin: PluginConfig);
    registerPackager(type: string, packager: (config: any) => IPackage);
    registerGroupEventHook(eventType: string, hook: Function): void;
    registerGlobalEventHook(eventType: string, hook: Function): void;
    registerPackageEventHook(packageType: string, eventType: string, hook: Function): void;
    generate(vars: any): Promise<{[key: string]: Function}>;
    getVars(): {[key: string]: any};
    setVar(key: string, value: any);
}

export default IGenerator