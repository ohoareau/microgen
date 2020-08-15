import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class DeployableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                deployable: true,
            },
        };
    }
}

export default DeployableBehaviour