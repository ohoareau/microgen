import ejs from 'ejs';
import {readFileSync} from 'fs';

export type ServiceMethodConfig = {
    name: string,
    code: string,
    async: boolean,
    args: string[],
    vars?: any,
};

const helpers = {
    readProjectFile: (path, dir = '../..') => readFileSync(`${dir}/${path}`, 'utf8')
}
export default class ServiceMethod {
    public readonly name: string;
    public readonly code: string;
    public readonly async: boolean;
    public readonly args: string[];
    constructor({name, code, async = false, vars = {}, args = []}: ServiceMethodConfig) {
        this.name = name;
        this.code = code ? ejs.render(code, {...vars, ...helpers}, {}) : code;
        this.async = async;
        this.args = args;
    }
}