module.exports = {
    plugins: [
        '@js-docker-image',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    projects: {
        myimage: {
            type: 'js-docker-image',
        }
    }
};
