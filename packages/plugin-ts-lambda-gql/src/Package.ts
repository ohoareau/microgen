import {AbstractPackage} from '@ohoareau/microgen';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
            project_name: 'myproject',
            "dependencies": {
                "apollo-server-lambda": "2.15.0",
                "graphql": "15.2.0"
            },
            "devDependencies": {
                "@types/node": "14.0.14",
                "@typescript-eslint/eslint-plugin": "2.30.0",
                "@typescript-eslint/parser": "2.30.0",
                "eslint": "6.8.0",
                "eslint-config-airbnb-base": "14.1.0",
                "eslint-import-resolver-alias": "1.1.2",
                "eslint-plugin-import": "2.20.2",
                "eslint-plugin-module-resolver": "0.16.0",
                "typescript": "3.9.5",
                "typescript-eslint": "0.0.1-alpha.0"
            },
            "scripts": {
                "lint": "eslint . --ext .js",
                "build": "tsc",
                "test": "echo \"Error: no test specified\" && exit 0"
            }
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['.eslintignore']: true,
            ['.eslintrc.js']: true,
            ['.gitignore']: true,
            ['LICENSE.md']: true,
            ['Makefile']: true,
            ['tsconfig.json']: true,
        };
    }
}