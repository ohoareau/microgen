module.exports = {
    plugins: [
        '@js-lambda',
    ],
    vars: {
        author: 'Olivier Hoareau <oha+oss@greenberets.io>',
    },
    packages: {
        xinea: {
            type: 'js-lambda',
            handlers: {
                handler: {
                    type: 'ping',
                },
            },
            microservices: {
                user: {
                    types: {
                        user: {
                            backends: ['dynamoose'],
                            operations: {
                                create: {},
                            }
                        }
                    }
                }
            }
        }
    }
};
