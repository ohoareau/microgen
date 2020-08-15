import IPackage from "./IPackage";

export interface IBehaviour {
    build(p: IPackage): any;
    buildDynamicVars(p: IPackage, vars: any): any;
}

export default IBehaviour