import {AbstractResource} from "./AbstractResource";

export type form = {
    name: string,
    package: string,
    type: string,
    fields: any[],
};

export class FormResource extends AbstractResource {
    public readonly name: string;
    public readonly package: string;
    public readonly type: string;
    public readonly fields: any[];
    public readonly componentName: string;
    constructor(config: form) {
        super();
        this.name = config.name;
        this.package = config.package;
        this.type = config.type;
        this.fields = config.fields;
        this.componentName = this.buildComponentName(this.name, 'form');
    }
}

export default FormResource