import ejs from 'ejs';
import {readFileSync} from 'fs';

export type ServiceMethodConfig = {
    name: string,
    code: string,
    async: boolean,
    args: string[],
    vars?: any,
    rootDir?: string,
};

const helpers = ({rootDir}) => ({
    readProjectFile: (path) => readFileSync(`${rootDir || process.cwd()}/${path}`, 'utf8')
});

export default class ServiceMethod {
    public readonly name: string;
    public readonly code: string;
    public readonly async: boolean;
    public readonly args: string[];
    constructor({rootDir, name, code, async = false, vars = {}, args = []}: ServiceMethodConfig) {
        this.name = name;
        this.code = code ? ejs.render(code, {...vars, ...helpers({rootDir})}, {}) : code;
        this.async = async;
        this.args = args;
    }
}