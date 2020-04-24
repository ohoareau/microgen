import {AbstractPackage} from '@ohoareau/microgen';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected buildVars(vars: any): any {
        vars = super.buildVars(vars);
        vars.version = vars.version || '1.0.0';
        vars.author = vars.author ? vars.author.name : 'Confidential';
        vars.author_email = vars.author ? vars.author.email : 'Confidential';
        vars.description = vars.description || 'Python AWS Lambda Layer';
        vars.url = vars.url || 'https://github.com';
        vars.pypi_repo = vars.pypi_repo || 'pypi';
        vars.dependencies = vars.dependencies || {};
        return vars;
    }
    protected buildFiles(vars: any, cfg: any): any {
        return {
            ['requirements.txt']: ({renderFile}) => renderFile(cfg)('requirements.txt.ejs', vars),
            ['LICENSE']: ({renderFile}) => renderFile(cfg)('LICENSE.md.ejs', vars),
            ['README.md']: ({renderFile}) => renderFile(cfg)('README.md.ejs', vars),
            ['.gitignore']: ({renderFile}) => renderFile(cfg)('.gitignore.ejs', vars),
            ['setup.py']: ({renderFile}) => renderFile(cfg)('setup.py.ejs', vars),
            ['Makefile']: ({renderFile}) => renderFile(cfg)('Makefile.ejs', vars),
            ['tests/__init__.py']: ({renderFile}) => renderFile(cfg)('tests/__init__.py.ejs', vars),
            ['package-excludes.lst']: ({renderFile}) => renderFile(cfg)('package-excludes.lst.ejs'),
        };
    }
}