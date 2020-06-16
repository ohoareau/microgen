module.exports = {
    plugins: [
        '@monorepo-platform',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        myproject: {
            type: 'monorepo-platform',
            vars: {
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
                ]
            },
        }
    }
};
