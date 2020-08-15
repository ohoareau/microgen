import IBehaviour from "./IBehaviour";
import IPackage from "./IPackage";

export abstract class AbstractBehaviour implements IBehaviour {
    constructor() {
    }
    build(p: IPackage): any {
        return {};
    }
    buildDynamicVars(p: IPackage, vars: any): any {
        return {};
    }
}

export default AbstractBehaviour