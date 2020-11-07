import IRegistry, {asset} from './IRegistry';

export type BaseRegistryConfig = {
    [key: string]: any,
}

export abstract class AbstractRegistry<C extends BaseRegistryConfig = BaseRegistryConfig> implements IRegistry {
    protected config: C;
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(cfg: C) {
        this.config = cfg;
    }
    abstract hasAsset(type: string, name: string): boolean;
    abstract getAsset(type: string, name: string): asset;
}

export default AbstractRegistry