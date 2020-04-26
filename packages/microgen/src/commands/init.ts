import MicroGen from '../MicroGen';

export default {
    command: 'init',
    describe: 'initializes the root project directory',
    builder: {
    },
    handler: async argv =>
        new MicroGen({
            ...(argv.config as any),
            rootDir: process.cwd(),
            verbose: argv.verbose || process.env.MICROGEN_VERBOSE || 0,
        }).init()
    ,
};