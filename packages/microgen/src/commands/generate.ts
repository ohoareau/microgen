import MicroGen from '../MicroGen';

export default {
    command: ['generate', '$0'],
    describe: 'generate the packages directories',
    builder: {
        target: {
            alias: 't',
            default: './packages',
        }
    },
    handler: async argv =>
        new MicroGen({
            ...(argv.config as any),
            rootDir: process.cwd(),
            verbose: argv.verbose || process.env.MICROGEN_VERBOSE || 0,
        }).generate({
            targetDir: argv.target,
            write: true,
            verbose: argv.verbose || process.env.MICROGEN_VERBOSE || 0,
        })
    ,
};