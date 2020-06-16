module.exports = {
    plugins: [
        '@js-next',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        app: {
            type: 'js-next',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                name: 'web-app',
            },
        }
    }
};
