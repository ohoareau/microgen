module.exports = {
    plugins: [
        '@js-statics',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        cdn: {
            type: 'js-statics',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                target_dir: 'some-target-dir',
                ignore_target_dir: false,
                name: 'cdn',
            },
        }
    }
};
