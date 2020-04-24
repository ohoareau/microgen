export type ServiceMethodConfig = {
    name: string,
    code: string,
    async: boolean,
    args: string[],
};

export default class ServiceMethod {
    public readonly name: string;
    public readonly code: string;
    public readonly async: boolean;
    public readonly args: string[];
    constructor({name, code, async = false, args = []}: ServiceMethodConfig) {
        this.name = name;
        this.code = code;
        this.async = async;
        this.args = args;
    }
}