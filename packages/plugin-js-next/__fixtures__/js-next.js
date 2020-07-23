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
                project_prefix: 'myothercompany',
                project_name: 'someproject',
                name: 'web-app',
            },
        }
    }
};
