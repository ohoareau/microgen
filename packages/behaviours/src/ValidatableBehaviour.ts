import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class ValidatableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                validatable: true,
            },
        };
    }
}

export default ValidatableBehaviour