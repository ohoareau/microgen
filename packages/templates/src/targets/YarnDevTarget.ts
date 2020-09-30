import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnDevTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'dev';
    }
    getCommandOptions(options: any): any {
        return {
            ...(options.options || {}),
        }
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        };
    }
}

export default YarnDevTarget