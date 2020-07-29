module.exports = {
    plugins: [
        '@js-docusaurus',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        front: {
            type: 'js-docusaurus',
            vars: {
                name: 'mysite',
            },
        }
    }
};
