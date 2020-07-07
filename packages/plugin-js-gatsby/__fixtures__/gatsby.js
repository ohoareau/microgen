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
                project_prefix: 'myothercompany',
                project_name: 'someproject',
                name: 'front',
            },
        }
    }
};
