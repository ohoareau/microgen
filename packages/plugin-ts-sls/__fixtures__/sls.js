module.exports = {
    plugins: [
        '@ts-sls',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        app: {
            type: 'ts-sls',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                name: 'api',
            },
        }
    }
};
