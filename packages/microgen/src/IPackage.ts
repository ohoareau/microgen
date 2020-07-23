export default interface IPackage {
    getPackageType(): string,
    getName(): string;
    describe(): Promise<any>;
    hydrate(data): Promise<void>;
    generate(vars: any): Promise<{[key: string]: Function}>;
}
