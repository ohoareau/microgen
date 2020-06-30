module.exports = {
    plugins: [
        '@monorepo-js-scripts',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        libs: {
            type: 'monorepo-js-scripts',
            vars: {
            }
        }
    }
};
