import {AbstractResource} from "./AbstractResource";

export type theme = {
    name: string,
};

export class ThemeResource extends AbstractResource {
    public readonly name: string;
    constructor(config: theme) {
        super();
        this.name = config.name;
    }
}

export default ThemeResource