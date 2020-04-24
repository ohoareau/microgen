import IGenerator from './IGenerator';

export type PluginConfig = {
    path?: string,
    name: string,
    config?: {[key: string]: any},
}

export interface IPlugin {
    register(generator: IGenerator): void;
}

export default IPlugin
