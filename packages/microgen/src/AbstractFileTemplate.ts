import AbstractTemplate from './AbstractTemplate';

export abstract class AbstractFileTemplate extends AbstractTemplate {
    protected constructor() {
        super();
    }
    getVars(): any {
        return {};
    }
    abstract getTemplatePath(): string;
    abstract getName(): string;
    describe() {
        return {
            dir: this.getTemplatePath(),
            name: this.getName(),
            vars: this.getVars(),
        }
    }
}

export default AbstractFileTemplate