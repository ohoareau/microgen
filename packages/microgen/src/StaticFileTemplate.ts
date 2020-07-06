import AbstractTemplate from './AbstractTemplate';

export class StaticFileTemplate extends AbstractTemplate {
    constructor(source: string, target: string) {
        super(({copy}) => copy(source, target));
    }
}

export default StaticFileTemplate