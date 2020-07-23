module.exports = {
    plugins: [
        '@js-react-app',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        app: {
            type: 'js-react-app',
            vars: {
                project_prefix: 'myothercompany',
                project_name: 'someproject',
                name: 'app',
            },
        }
    }
};
