module.exports = {
    plugins: [
        '@js-lambda',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
        locked: {
            'api/abcd/def.js': true,
        }
    },
    packages: {
        api: {
            type: 'js-lambda',
            files: {
                'abcd/def.js': 'module.exports = {};',
            }
        }
    }
};
