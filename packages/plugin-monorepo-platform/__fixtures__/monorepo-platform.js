module.exports = {
    plugins: [
        '@monorepo-platform',
        '@js-gatsby',
        '@js-lambda',
        '@js-next',
        '@js-react-app',
    ],
    projects: {
        front: {type: 'js-gatsby'},
        app: {type: 'js-next'},
        back: {type: 'js-react-app'},
        api: {type: 'js-lambda'},
        projectx: {},
        projecty: {},
        projectz: {},
        projectt: {},
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
            technologies: {
                sometechno: {name: 'Some other techno', link: 'https://mytechno.org'},
            },
            readme: true,
        },
    }
};
