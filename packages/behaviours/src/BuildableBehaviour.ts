import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class BuildableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                buildable: true,
            },
        };
    }
}

export default BuildableBehaviour