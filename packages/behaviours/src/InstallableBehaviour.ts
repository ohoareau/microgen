import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class InstallableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                installable: true,
            },
        };
    }
}

export default InstallableBehaviour