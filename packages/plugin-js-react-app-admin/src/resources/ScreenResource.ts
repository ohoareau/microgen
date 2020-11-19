import {AbstractResource} from "./AbstractResource";

export type screen = {
    name: string,
    package: string,
    type: string,
};

export class ScreenResource extends AbstractResource {
    public readonly name: string;
    public readonly package: string;
    public readonly type: string;
    constructor(config: screen) {
        super();
        this.name = config.name;
        this.package = config.package;
        this.type = config.type;
    }
}

export default ScreenResource