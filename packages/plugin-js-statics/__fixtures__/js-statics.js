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
                name: 'cdn',
            },
        }
    }
};
