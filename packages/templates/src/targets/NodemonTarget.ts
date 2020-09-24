import GenericTarget from './GenericTarget';

export class NodemonTarget extends GenericTarget {
    buildSteps(options: any) {
        const envs = {
            AWS_REGION: '$(AWS_REGION)',
            AWS_SDK_LOAD_CONFIG: 1,
            AWS_PROFILE: '$(AWS_PROFILE)',
            ...(options.envs || {}),
        };
        return [
            this.buildCli(
                `${this.flattenEnvs(envs)} ./node_modules/.bin/nodemon ${options.script || 'server.js'}`,
                [],
                [],
                options,
                {},
                [],
                [],
                {
                    PORT: options.port || 4000,
                },
            )
        ];
    }
    protected flattenEnvs(envs) {
        return Object.entries(envs).reduce((acc, [k, v]) => {
            acc = `${acc || ''}${acc ? ' ' : ''}${k}=${v}`;
            return acc;
        }, '');
    }
}

export default NodemonTarget