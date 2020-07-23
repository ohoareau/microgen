export default interface IPackage {
    getPackageType(): string,
    getName(): string;
    generate(vars: any): Promise<{[key: string]: Function}>;
    build(vars: any): Promise<void>;
}
