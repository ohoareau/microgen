export interface IPackage {
    getPackageType(): string,
    getName(): string;
    getDescription(): string;
    getFeatures(): any;
    getExtraOptions(): any;
    getExtraOption(name: string, defaultValue?: any): any;
    hasFeature(name: string, defaultValue? : boolean): boolean;
    describe(): Promise<any>;
    hydrate(data): Promise<void>;
    generate(vars: any): Promise<{[key: string]: Function}>;
}

export default IPackage;
