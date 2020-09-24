import GenericTarget from './GenericTarget';

export class NodemonTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            this.buildCli(
                `AWS_REGION=$(AWS_REGION) AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ./node_modules/.bin/nodemon ${options.script || 'server.js'}`,
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
}

export default NodemonTarget