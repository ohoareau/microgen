module.exports = {
    plugins: [
        '@ts-lambda-gql',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        cdn: {
            type: 'ts-lambda-gql',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                name: 'gql',
            },
        }
    }
};
