module.exports = {
    plugins: [
        '@js-react-app-admin',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
    },
    packages: {
        app: {
            type: 'js-react-app-admin',
            vars: {
                readme: true,
                project_prefix: 'myothercompany',
                project_name: 'someproject',
                name: 'app',
                envs_from_terraform: {
                    aws_cloudfront_distribution_id_admin: "@websites-admin:cloudfront_id",
                    react_app_api_core_endpoint: "@apis-core:endpoint"
                }
            },
            types: {
                user: {},
                organization: {},
                content: {},
            }
        }
    }
};
