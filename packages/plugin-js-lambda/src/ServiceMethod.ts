import ejs from 'ejs';
import {readFileSync} from 'fs';

export type ServiceMethodConfig = {
    name: string,
    code: string,
    async: boolean,
    args: string[],
    vars?: any,
    rootDir?: string,
    service: any,
};

const helpers = ({rootDir, service, serviceMethod}) => ({
    readProjectFile: (path) => readFileSync(`${rootDir || process.cwd()}/${path}`, 'utf8'),
    service,
    serviceMethod,
});

export default class ServiceMethod {
    public readonly name: string;
    public readonly code: string;
    public readonly async: boolean;
    public readonly args: string[];
    constructor({rootDir, service, name, code, async = false, vars = {}, args = []}: ServiceMethodConfig) {
        this.name = name;
        this.async = async;
        this.args = args;
        let previousCode;
        let loop = 0;
        do {
            previousCode = code;
            code = code ? ejs.render(code, {...vars, service, ...helpers({rootDir, service, serviceMethod: this})}, {}) : code
            loop++;
        } while (code !== previousCode && loop < 5)
        this.code = code;
    }
}