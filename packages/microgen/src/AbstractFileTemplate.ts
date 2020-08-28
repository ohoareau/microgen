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
    isIgnored() {
        return false;
    }
    describe() {
        return {
            dir: this.getTemplatePath(),
            name: this.getName(),
            vars: this.getVars(),
            ignored: this.isIgnored(),
        }
    }
}

export default AbstractFileTemplate