module.exports = {
    addons: [
        '@storybook/addon-viewport/register',
        {
            name: '@storybook/addon-storysource',
            options: {
                rule: {
                    test: [/\.stories\.tsx?$/],
                    include: [`${process.cwd()}/__stories__`],
                },
                loaderOptions: {
                    parser: 'typescript',
                },
            },
        },
        '@storybook/addon-knobs/register',
        '@storybook/addon-actions/register',
    ],
    stories: [`${process.cwd()}/__stories__/*.stories.tsx`],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: ['@babel/preset-typescript', '@babel/preset-react'],
            },
        });
        config.resolve.extensions.push('.ts', '.tsx');
        config.module.rules = config.module.rules.map(rule => {
            if (
                String(rule.test) === String(/\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/)
            ) {
                return {
                    ...rule,
                    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
                }
            }

            return rule
        })
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"],
        })
        return config;
    },
};