module.exports = {
    plugins: [
        '@js-lambda',
    ],
    vars: {
        author: 'Olivier Hoareau <oha+oss@greenberets.io>',
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
