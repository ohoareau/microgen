module.exports = {
    plugins: [
        '@js-lambda',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        'hook-as-string': {
            type: 'js-lambda',
            microservices: {
                m1: {
                    types: {
                        t1: {
                            operations: {
                                create: {
                                    hooks: {
                                        before: [
                                            'b1',
                                            'b2',
                                            {type: 'b3'},
                                            {type: 'b4', config: {}},
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
