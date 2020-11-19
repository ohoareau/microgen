import {AbstractResource} from "./AbstractResource";

export type translation = {
    name: string,
};

export class TranslationResource extends AbstractResource {
    public readonly name: string;
    constructor(config: translation) {
        super();
        this.name = config.name;
    }
}

export default TranslationResource