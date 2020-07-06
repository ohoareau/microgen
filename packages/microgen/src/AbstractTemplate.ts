import ITemplate from './ITemplate';
import {jsStringify, render, renderFile} from './utils';

export abstract class AbstractTemplate implements ITemplate {
    private readonly factory: Function|undefined;
    protected constructor(source?: string|Function) {
        this.factory = 'function' === typeof source ? source : ((undefined === source) ? undefined :() => source);
    }
    describe(): any {
        return undefined;
    }
    build(helpers): string {
        if (this.factory) {
            return this.factory(helpers);
        }
        const description = this.describe();
        if (!description) return '';
        const {dir, name, vars = {}}: {dir: string, name: string, vars: any} = description;
        return helpers.renderFile({templatePath: dir})(name, vars);
    }
    render(helpers: {copy} = {copy: () => {}}): string {
        return this.build({render, renderFile, jsStringify, ...helpers});
    }
}

export default AbstractTemplate