export type asset = {
    [key: string]: any,
};

export interface IRegistry {
    hasAsset(type: string, name: string): boolean;
    getAsset(type: string, name: string): asset;
}

export default IRegistry;
