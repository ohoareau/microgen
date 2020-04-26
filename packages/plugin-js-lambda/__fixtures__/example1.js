module.exports = {
    plugins: [
        '@js-lambda',
    ],
    vars: {
        author: 'Olivier Hoareau <oha+oss@greenberets.io>',
    },
    packages: {
        p0: {
            type: 'js-lambda',
            name: 'test-project-2',
        },
        p1: {
            type: 'js-lambda',
            name: 'test-project',
            files: {
                'schema.graphql': `schema {
    query: Query
    mutation: Mutation
}                
type Query {
    getLog: String
    getUsers: String
    getOrganization: String
}
type Mutation {
    createLog: String
    createUser: String
    createOrganization: String
}
`,
            },
            vars: {
                license: 'MIT',
                dependencies: {
                },
            },
            sources: ['custom'],
            events: {
                user_login: [
                    {
                        type: 'operation',
                        config: {
                            operation: 'log_log_create',
                            params: {input: {type: 'user.login', targetType: 'user', targetId: '{{sub}}'}}
                        }
                    },
                    {
                        type: 'operation',
                        config: {operation: 'user_user_update', params: {id: '{{sub}}', input: {loggedAt: '{{now}}'}}}
                    }
                ]
            },
            handlers: {
                graphql: {
                    type: 'graphql',
                    vars: {
                        schemaFile: '../schema.graphql',
                        resolvers: {
                            Query: {
                                getLog: 'log_log_get',
                                getUsers: 'user_user_find',
                                getOrganization: 'user_organization_get',
                            },
                            Mutation: {
                                createLog: 'log_log_create',
                                createUser: 'user_user_create',
                                createOrganization: 'user_organization_create',
                            }
                        }
                    }
                },
                handler: {
                    type: 'controller',
                    middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                },
                events: {
                    type: 'service',
                    vars: {service: '@event', method: 'consume'},
                    middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                    test: {
                        mocks: ['dynamoose'],
                        groups: {
                            handler: {
                                tests: [
                                    {name: 'handler callable', type: 'handler-is-callable'},
                                    {
                                        name: 'no records key returns nothing',
                                        type: 'handler-call',
                                        config: {event: {}, expected: {}}
                                    },
                                    {
                                        name: 'no records returns nothing',
                                        type: 'handler-call',
                                        config: {event: {Records: []}, expected: {}}
                                    },
                                ]
                            }
                        }
                    }
                },
                migrate: {
                    type: 'service',
                    vars: {service: '@migration', method: 'migrate'},
                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                }
            },
            microservices: {
                log: {
                    handlers: {
                        handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']},
                    },
                    types: {
                        log: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    type: 'string!',
                                    targetType: 'string',
                                    targetId: 'string',
                                    targetName: 'string',
                                    sourceType: 'string',
                                    sourceId: 'string',
                                    sourceName: 'string',
                                    sourceIp: 'string'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']},
                            },
                            operations: {
                                create: {},
                                get: {},
                                update: {},
                                delete: {},
                                find: {},
                            }
                        }
                    }
                },
                module: {
                    handlers: {
                        handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']},
                    },
                    types: {
                        module: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    code: 'string!',
                                    name: 'string!',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']},
                            },
                            operations: {
                                create: {
                                    hooks: {
                                        notify: [{type: '@dispatch'}],
                                    },
                                },
                                get: {},
                                update: {
                                    hooks: {
                                        notify: [{type: '@dispatch'}],
                                    },
                                },
                                delete: {
                                    hooks: {
                                        notify: [{type: '@dispatch'}],
                                    },
                                },
                                find: {}
                            }
                        },
                        screen: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    module: '@ref:module!',
                                    moduleName: ':refattr:module:name',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        variable: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    code: 'string!',
                                    description: 'string',
                                    module: '@ref:module!',
                                    moduleName: ':refattr:module:name',
                                    type: {
                                        type: 'constant',
                                        required: true,
                                        config: {
                                            values: [
                                                'email',
                                                'richtext',
                                                'image',
                                                'url',
                                                'json',
                                                'text',
                                                'longtext',
                                                'integer',
                                                'float',
                                                'boolean',
                                                'choice',
                                                'file',
                                                'choices',
                                                'year',
                                                'yearmonth',
                                                'date',
                                                'datetime',
                                                'price',
                                                'percentage',
                                                'angle'
                                            ]
                                        }
                                    },
                                    constraints: {type: 'string', default: [], list: true},
                                    definition: {type: 'string', default: '{}'},
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        rule: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    module: '@ref:module!',
                                    moduleName: ':refattr:module:name',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        function: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    title: 'string',
                                    description: 'string',
                                    capacity: {
                                        type: 'constant',
                                        required: true,
                                        config: {values: ['min', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'max']}
                                    },
                                    module: '@ref:module!',
                                    moduleName: ':refattr:module:name',
                                    inputVariables: {
                                        type: [{type: {id: {type: 'uuid', required: true}}}],
                                        volatile: true,
                                        default: []
                                    },
                                    outputVariables: {
                                        type: [{type: {id: {type: 'uuid', required: true}}}],
                                        volatile: true,
                                        default: []
                                    },
                                    code: 'string!',
                                    configCode: {type: 'string', default: ''},
                                    language: {type: 'string', required: true, default: 'python'},
                                    status: {
                                        type: 'workflow',
                                        default: 'CREATION_IN_PROGRESS',
                                        config: {
                                            steps: [
                                                'CREATION_IN_PROGRESS',
                                                'CREATED',
                                                'CREATION_FAILED',
                                                'UPDATE_FAILED',
                                                'DELETE_IN_PROGRESS',
                                                'UPDATE_IN_PROGRESS',
                                                'DELETE_FAILED'
                                            ]
                                        }
                                    },
                                    statusMessage: 'string',
                                    tags: 'tags',
                                    lambdaArn: 'arn'
                                }
                            },
                            backends: ['@dynamoose', '@lambda'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {
                                    hooks: {
                                        after: [
                                            {
                                                type: '@job',
                                                ensureKeys: ['code', 'configCode'],
                                                config: {stateMachine: '[[process.env.MICROSERVICE_FUNCTION_CREATE_STATE_MACHINE_ARN]]'}
                                            },
                                            {
                                                type: '@operation',
                                                iteratorKey: 'inputVariables',
                                                config: {
                                                    operation: 'module_inputvar_create',
                                                    params: {criteria: {function: '{{parentId}}', variable: '{{id}}'}}
                                                }
                                            },
                                            {
                                                type: '@operation',
                                                iteratorKey: 'outputVariables',
                                                config: {
                                                    operation: 'module_outputvar_create',
                                                    params: {criteria: {function: '{{parentId}}', variable: '{{id}}'}}
                                                }
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                get: {},
                                update: {
                                    hooks: {
                                        after: [
                                            {
                                                type: '@job',
                                                ensureKeys: ['code', 'configCode'],
                                                trackData: ['name', 'code', 'configCode', 'capacity', 'language'],
                                                config: {stateMachine: '[[process.env.MICROSERVICE_FUNCTION_UPDATE_STATE_MACHINE_ARN]]'}
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                delete: {
                                    hooks: {
                                        after: [
                                            {
                                                type: '@job',
                                                config: {stateMachine: '[[process.env.MICROSERVICE_FUNCTION_DELETE_STATE_MACHINE_ARN]]'}
                                            },
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'module_inputvar_delete',
                                                    params: {criteria: {function: '{{id}}'}}
                                                }
                                            },
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'module_outputvar_delete',
                                                    params: {criteria: {function: '{{id}}'}}
                                                }
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                find: {},
                                execute: {
                                    backend: 'lambda',
                                    hooks: {
                                        populate: [{type: '@get', config: {fields: ['name', 'lambdaArn']}}],
                                        transform: [{type: '@mutate', config: {type: 'reverse_gvalues'}}],
                                        after: [{type: '@mutate', config: {type: 'gvalues'}}]
                                    }
                                }
                            }
                        },
                        template: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    module: '@ref:module!',
                                    moduleName: ':refattr:module:name',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        role: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    code: 'string!',
                                    description: 'string',
                                    module: '@ref:module!',
                                    moduleName: ':refattr:module:name',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        inputvar: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    variable: 'ref:variable!',
                                    function: '@ref:function!',
                                    name: ':refattr:variable:name',
                                    code: ':refattr:variable:code',
                                    type: ':refattr:variable:type'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {create: {}, get: {}, update: {}, delete: {}, find: {}}
                        },
                        outputvar: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    variable: 'ref:variable!',
                                    function: '@ref:function!',
                                    name: ':refattr:variable:name',
                                    code: ':refattr:variable:code',
                                    type: ':refattr:variable:type'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {create: {}, get: {}, update: {}, delete: {}, find: {}}
                        }
                    }
                },
                notification: {
                    handlers: {handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']}},
                    types: {
                        notification: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    sentAt: ':timestamp',
                                    deliveredAt: ':timestamp',
                                    bouncedAt: ':timestamp',
                                    complainedAt: ':timestamp',
                                    language: 'string!',
                                    template: 'string!',
                                    subjectTemplate: 'string',
                                    variables: 'string!',
                                    type: {
                                        type: 'constant',
                                        required: true,
                                        config: {values: ['email', 'sms', 'push']}
                                    },
                                    status: {
                                        type: 'workflow',
                                        default: 'CREATED',
                                        config: {steps: ['CREATED', 'SENDING', 'SENT', 'BOUNCED', 'COMPLAINED', 'DELIVERED', 'SEND_FAILED']}
                                    },
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        }
                    }
                },
                project: {
                    handlers: {handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']}},
                    types: {
                        project: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    owner: '#uuid!',
                                    organization: '#uuid!',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {
                                    hooks: {
                                        after: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'project_member_create',
                                                    params: {
                                                        input: {
                                                            type: 'user',
                                                            user: '{{owner}}',
                                                            project: '{{id}}',
                                                            roles: ['owner']
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'project_member_create',
                                                    params: {
                                                        input: {
                                                            type: 'organization',
                                                            organization: '{{organization}}',
                                                            project: '{{id}}',
                                                            roles: ['owner']
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        notify: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'log_log_create',
                                                    params: {
                                                        input: {
                                                            type: 'project.created',
                                                            targetType: 'project',
                                                            targetId: '{{id}}',
                                                            targetName: '{{name}}',
                                                            sourceType: 'user',
                                                            sourceId: '{{owner}}',
                                                            sourceName: '{{owner}}'
                                                        }
                                                    }
                                                }
                                            },
                                            {type: '@dispatch'}
                                        ]
                                    }
                                },
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {
                                    hooks: {
                                        after: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'project_member_delete',
                                                    params: {criteria: {project: '{{id}}'}}
                                                }
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                find: {}
                            }
                        },
                        member: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    type: {
                                        type: 'constant',
                                        required: true,
                                        config: {values: ['user', 'organization']}
                                    },
                                    organization: '@ref:user.organization',
                                    organizationName: ':refattr:organization:name',
                                    user: '@ref:user.user',
                                    userEmail: ':refattr:user:email',
                                    userFirstName: ':refattr:user:lastName',
                                    userLastName: ':refattr:user:firstName',
                                    project: '@ref:project!',
                                    projectName: ':refattr:project:name',
                                    projectStatus: ':refattr:project:status',
                                    projectCreatedAt: ':refattr:project:createdAt',
                                    roles: {type: 'string', list: true},
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        modactivation: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    project: '@ref:project!',
                                    projectName: ':refattr:project:name',
                                    module: '@ref:module.module',
                                    name: ':refattr:module:name',
                                    code: ':refattr:module:code',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        contact: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {create: {}, get: {}, update: {}, delete: {}, find: {}}
                        }
                    }
                },
                tag: {
                    handlers: {handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']}},
                    types: {
                        tag: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    name: 'string!',
                                    set: '@string!',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        }
                    }
                },
                user: {
                    handlers: {handler: {type: 'controller', middlewares: ['@warmup', '@error', '@debug', '@authorizer']}},
                    types: {
                        user: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    loggedAt: 'loggedAt',
                                    email: 'email!',
                                    firstName: 'firstName!',
                                    lastName: 'lastName!',
                                    phone: 'phone',
                                    admin: 'flag',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {
                                    hooks: {
                                        before: [
                                            {
                                                type: '@cognito-user-create',
                                                config: {
                                                    userPool: '[[process.env.COGNITO_USER_POOL_USERS_ID]]',
                                                    group: '[[process.env.COGNITO_USER_POOL_USERS_GROUP_USERS]]',
                                                    adminGroup: '[[process.env.COGNITO_USER_POOL_USERS_GROUP_ADMINS]]'
                                                }
                                            }
                                        ],
                                        notify: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'log_log_create',
                                                    params: {
                                                        input: {
                                                            type: 'user.created',
                                                            targetType: 'user',
                                                            targetId: '{{id}}',
                                                            targetName: '{{firstName}} {{lastName}}'
                                                        }
                                                    }
                                                }
                                            },
                                            {type: '@dispatch'}
                                        ]
                                    }
                                },
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {
                                    hooks: {
                                        before: [{
                                            type: '@cognito-user-delete',
                                            config: {userPool: '[[process.env.COGNITO_USER_POOL_USERS_ID]]'}
                                        }],
                                        notify: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'log_log_create',
                                                    params: {
                                                        input: {
                                                            type: 'user.deleted',
                                                            targetType: 'user',
                                                            targetId: '{{id}}'
                                                        }
                                                    }
                                                }
                                            },
                                            {type: '@dispatch'}
                                        ]
                                    }
                                },
                                find: {}
                            }
                        },
                        organization: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt',
                                    owner: '#uuid!',
                                    name: 'string!',
                                    status: {type: 'workflow', default: 'CREATED', config: {steps: ['CREATED']}},
                                    tags: 'tags',
                                    duns: 'duns',
                                    apeCode: 'apeCode',
                                    siren: 'siren',
                                    siret: 'siret',
                                    city: 'city',
                                    address: 'address',
                                    zipCode: 'zipCode',
                                    country: 'country',
                                    phone: 'phone',
                                    fax: 'fax',
                                    email: 'email',
                                    billingEmail: 'email',
                                    vatNumber: 'vatNumber',
                                    comments: 'string',
                                    website: 'website',
                                    facebook: 'facebook',
                                    twitter: 'twitter',
                                    instagram: 'instagram',
                                    youtube: 'youtube',
                                    rcs: 'rcs'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {
                                    hooks: {
                                        after: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'user_membership_create',
                                                    params: {
                                                        input: {
                                                            type: 'organization',
                                                            user: '{{owner}}',
                                                            object: '{{id}}',
                                                            role: 'owner',
                                                            objectName: 'name'
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        notify: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'log_log_create',
                                                    params: {
                                                        input: {
                                                            type: 'organization.created',
                                                            targetType: 'organization',
                                                            targetId: '{{id}}',
                                                            targetName: '{{name}}',
                                                            sourceType: 'user',
                                                            sourceId: '{{owner}}',
                                                            sourceName: '{{owner}}'
                                                        }
                                                    }
                                                }
                                            },
                                            {type: '@dispatch'}
                                        ]
                                    }
                                },
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {
                                    hooks: {
                                        delete: [
                                            {
                                                type: '@operation',
                                                config: {
                                                    operation: 'user_membership_delete',
                                                    params: {criteria: {object: '{{id}}'}}
                                                }
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                find: {}
                            }
                        },
                        membership: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    user: '@ref:user!',
                                    userEmail: ':refattr:user:email',
                                    userFirstName: ':refattr:user:lastName',
                                    userLastName: ':refattr:user:firstName',
                                    object: '@uuid',
                                    type: 'string!',
                                    objectName: 'string',
                                    role: 'string!',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {
                                    hooks: {
                                        populate: [
                                            {
                                                type: '@populate-from-operation',
                                                config: {
                                                    operation: 'user_organization_get',
                                                    targetData: {objectName: 'name'},
                                                    params: {id: '{{data.object}}', fields: ['id', 'name']}
                                                }
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                get: {},
                                update: {
                                    hooks: {
                                        populate: [
                                            {
                                                type: '@populate-from-operation',
                                                config: {
                                                    operation: 'user_organization_get',
                                                    targetData: {objectName: 'name'},
                                                    params: {id: '{{data.object}}', fields: ['id', 'name']}
                                                }
                                            }
                                        ],
                                        notify: [{type: '@dispatch'}]
                                    }
                                },
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        },
                        modactivation: {
                            schema: {
                                attributes: {
                                    id: '&:autoUuid',
                                    organization: '@ref:organization!',
                                    organizationName: ':refattr:organization:name',
                                    module: '@ref:module.module',
                                    name: ':refattr:module:name',
                                    createdAt: ':createdAt',
                                    updatedAt: ':updatedAt'
                                }
                            },
                            backends: ['@dynamoose'],
                            middlewares: ['@warmup', '@error', '@debug', '@authorizer'],
                            handlers: {
                                handler: {
                                    type: 'controller',
                                    middlewares: ['@warmup', '@error', '@debug', '@authorizer']
                                }
                            },
                            operations: {
                                create: {hooks: {notify: [{type: '@dispatch'}]}},
                                get: {},
                                update: {hooks: {notify: [{type: '@dispatch'}]}},
                                delete: {hooks: {notify: [{type: '@dispatch'}]}},
                                find: {}
                            }
                        }
                    }
                }
            }
        }
    }
};
