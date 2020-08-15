import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class StartableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                startable: true,
            },
        };
    }
    buildDynamicVars(p: IPackage, vars: any): any {
        const defaultPort = 3000;
        const port = p.getParameter('port', defaultPort + p.getParameter('startableOrder', 0));
        return {
            startPort: (defaultPort !== port) ? port : undefined,
        };
    }
}

export default StartableBehaviour