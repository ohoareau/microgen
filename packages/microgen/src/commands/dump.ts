export default {
    command: 'dump',
    describe: 'dump the entire config',
    builder: {
    },
    handler: async argv =>
        console.log(JSON.stringify(argv.c, null, 4))
    ,
};