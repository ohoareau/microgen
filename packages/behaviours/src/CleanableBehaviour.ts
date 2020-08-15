import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class CleanableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                cleanable: true,
            },
        };
    }
}

export default CleanableBehaviour