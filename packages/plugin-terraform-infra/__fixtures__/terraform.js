module.exports = {
    plugins: [
        '@terraform-infra',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        infra: {
            type: 'terraform-infra',
            vars: {
                prefix: 'myothercompany',
            },
        }
    }
};
