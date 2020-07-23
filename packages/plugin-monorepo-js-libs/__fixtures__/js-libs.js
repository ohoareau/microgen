module.exports = {
    plugins: [
        '@js-libs',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        libs: {
            type: 'js-libs',
            vars: {
                npm_scope: 'myscope',
            }
        }
    }
};
