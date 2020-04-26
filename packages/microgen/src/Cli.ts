import {Argv} from 'yargs';
import * as commands from './commands';

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
        yargs
            .coerce('config', arg => {
                try {
                    return require(require('fs').realpathSync(arg));
                } catch (e) {
                    return {};
                }
            })
            .count('verbose')
            .options({
                config: {
                    alias: 'c',
                    default: './microgen.js',
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