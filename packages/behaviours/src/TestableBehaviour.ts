import {IPackage, AbstractBehaviour} from "@ohoareau/microgen";

export class TestableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                testable: true,
            },
        };
    }
}

export default TestableBehaviour