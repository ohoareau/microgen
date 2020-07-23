module.exports = {
    plugins: [
        '@monorepo-platform',
        '@js-gatsby',
    ],
    projects: {
        app: {type: 'js-gatsby'}
    },
    root: {
        type: 'monorepo-platform',
        vars: {
            author: {
                name: 'Olivier Hoareau',
                email: 'oha+oss@greenberets.io',
            },
            prefix: 'myothercompany',
            project: 'someproject',
            projects: [
                {name: 'app', deployable: true},
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
