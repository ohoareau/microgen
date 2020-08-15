import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class PreInstallableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                preInstallable: true,
            },
        };
    }
}

export default PreInstallableBehaviour