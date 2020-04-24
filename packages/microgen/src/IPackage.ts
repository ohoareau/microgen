export default interface IPackage {
    getName(): string;
    generate(vars: any): Promise<{[key: string]: Function}>;
}
