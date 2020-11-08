import {Argv} from 'yargs';
import * as commands from './commands';
import dir2obj from '@ohoareau/dir2obj';

export class Cli {
    private readonly yargs: Argv;
    private readonly pkg: any;
    static main() {
        new Cli().run();
    }
    constructor() {
        this.pkg = require('../package');
        this.yargs = Cli.createYargs(this.pkg);
        this.registerOptions(this.yargs, this.pkg);
        this.registerCommands(this.yargs);
    }
    private static createYargs(pkg: any): Argv {
        require('yargonaut').style('green');
        return require('yargs')
            .scriptName('microgen')
            .usage('$0 <cmd> [args]')
            .help('h')
            .showHelpOnFail(false, "Specify --help for available options")
            .epilog(`copyright 2020 - ${pkg.author.name} <${pkg.author.email}>`)
        ;
    }
    private registerOptions(yargs: Argv, pkg: any) {
        let cachedConfig: any = undefined;
        yargs
            .coerce('config', arg => {
                if (cachedConfig) return cachedConfig;
                try {
                    const fs = require('fs');
                    const path = fs.realpathSync(arg);
                    let cfg = {};
                    if (fs.existsSync(path)) {
                        if (fs.lstatSync(path).isDirectory()) {
                            const genJsDir = `${path}/.genjs`;
                            const microgenJsFile = `${path}/microgen.js`;
                            const genJsFile = `${path}/gen.js`;
                            if (fs.existsSync(genJsDir)) {
                                if (fs.lstatSync(genJsDir).isDirectory()) {
                                    cfg = {...cfg, ...dir2obj(genJsDir, {ignoreDots: true})};
                                }
                            }
                            if (fs.existsSync(microgenJsFile)) {
                                if (!fs.lstatSync(microgenJsFile).isDirectory()) {
                                    cfg = {...cfg, ...require(microgenJsFile)};
                                }
                            }
                            if (fs.existsSync(genJsFile)) {
                                if (!fs.lstatSync(genJsFile).isDirectory()) {
                                    cfg = {...cfg, ...require(genJsFile)};
                                }
                            }
                        } else {
                            cfg = {...cfg, ...require(path)};
                        }
                    }
                    cachedConfig = cfg;
                    return cachedConfig;
                } catch (e) {
                    console.error(e.message);
                    cachedConfig = {};
                    return cachedConfig;
                }
            })
            .count('verbose')
            .options({
                config: {
                    alias: 'c',
                    default: '.',
                }
            })
            .alias('v', 'verbose')
            .version(pkg.version)
            .describe('version', 'show version information')
        ;
    }
    private registerCommands(yargs: Argv) {
        Object.values(commands).forEach(c => yargs.command(c));
    }
    run() {
        this.yargs.argv;
    }
}

export default Cli