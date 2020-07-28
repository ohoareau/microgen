module.exports = {
    plugins: [
        '@monorepo-platform',
        '@js-gatsby',
        '@js-lambda',
        '@js-react-app',
    ],
    projects: {
        app: {type: 'js-gatsby'},
        back: {type: 'js-react-app'},
        api: {type: 'js-lambda'}
    },
    root: {
        type: 'monorepo-platform',
        vars: {
            author: {
                name: 'Olivier Hoareau',
                email: 'oha+oss@greenberets.io',
            },
            project_envs: {
                dev: {},
                test: {},
                preprod: {},
                prod: {},
            },
            prefix: 'myothercompany',
            project: 'someproject',
            projects: [
                {name: 'app', deployable: true},
                {name: 'back', deployable: true},
                {name: 'front', startable: true, deployable: true},
                {name: 'api', phase: 'pre'},
                {name: 'projectx'},
                {name: 'projecty'},
                {name: 'projectz'},
                {name: 'projectt'},
            ],
            technologies: {
                sometechno: {name: 'Some other techno', link: 'https://mytechno.org'},
            },
            readme: true,
        },
    }
};
