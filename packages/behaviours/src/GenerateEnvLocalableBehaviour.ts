import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class GenerateEnvLocalableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                generateEnvLocalable: true,
            },
        };
    }
}

export default GenerateEnvLocalableBehaviour