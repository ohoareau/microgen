module.exports = {
    plugins: [
        '@js-gatsby',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        front: {
            type: 'js-gatsby',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                name: 'front',
            },
        }
    }
};
