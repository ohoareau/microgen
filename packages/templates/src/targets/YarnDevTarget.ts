import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnDevTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'dev';
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        };
    }
}

export default YarnDevTarget