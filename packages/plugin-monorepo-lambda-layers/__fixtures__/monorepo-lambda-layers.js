module.exports = {
    plugins: [
        '@monorepo-lambda-layers',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    root: {
        type: 'monorepo-lambda-layers',
        vars: {
            npm_scope: 'hello',
            project_copyright: 'The copyright.'
        }
    }
};
