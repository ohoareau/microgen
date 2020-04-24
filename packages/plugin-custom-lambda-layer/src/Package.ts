import {AbstractPackage} from '@ohoareau/microgen';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected buildFiles(vars: any, cfg: any): any {
        return {
            ['LICENSE']: ({renderFile}) => renderFile(cfg)('LICENSE.md.ejs', vars),
            ['README.md']: ({renderFile}) => renderFile(cfg)('README.md.ejs', vars),
            ['.gitignore']: ({renderFile}) => renderFile(cfg)('.gitignore.ejs', vars),
            ['Makefile']: ({renderFile}) => renderFile(cfg)('Makefile.ejs', vars),
        };
    }
}