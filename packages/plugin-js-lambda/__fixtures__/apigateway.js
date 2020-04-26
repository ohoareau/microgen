module.exports = {
    plugins: [
        '@js-lambda',
    ],
    vars: {
        author: 'Olivier Hoareau <oha+oss@greenberets.io>',
    },
    packages: {
        api: {
            type: 'js-lambda',
            handlers: {
                handler: {
                    type: 'apigateway',
                    vars: {
                        routes: {
                            'GET /user': 'user_user_getCurrent',
                            'POST /user': 'user_user_create',
                            'GET /users/:id': 'user_user_get',
                            'PUT /users/:id': 'user_user_update',
                            'DELETE /users/:id': 'user_user_delete',
                            'POST /some-non/standard/:route/:with/id': 'user_user_mySpecificMethod',
                        }
                    }
                },
                handlerWithCustomError: {
                    type: 'apigateway',
                    vars: {
                        jwt: true,
                        errors: {
                            404: {code: 403, message: 'You are not allowed to access this resource.'},
                            403: {code: 403, message: 'You are not allowed to access this resource.'},
                            412: {code: 403, message: 'You are not allowed to access this resource.'},
                            500: {code: 403, message: 'You are not allowed to access this resource.'},
                        },
                        routes: {
                            'GET /user': 'user_user_getCurrent',
                            'POST /user': 'user_user_create',
                            'GET /users/:id': 'user_user_get',
                            'PUT /users/:id': 'user_user_update',
                            'DELETE /users/:id': 'user_user_delete',
                            'POST /some-non/standard/:route/:with/id': 'user_user_mySpecificMethod',
                        }
                    }
                },
            },
            microservices: {
                user: {
                    types: {
                        user: {
                            test: {
                                groups: {
                                    g1: {
                                        name: 'g1',
                                        tests: [
                                            {name: 'dummy', type: 'empty'},
                                        ]
                                    }
                                }
                            },
                            backends: ['@dynamoose'],
                            operations: {
                                create: {},
                                get: {},
                                update: {},
                                delete: {},
                                getCurrent: {},
                                mySpecificMethod: {},
                            }
                        }
                    }
                }
            }
        }
    }
};
