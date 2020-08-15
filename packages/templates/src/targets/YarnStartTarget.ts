import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnStartTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'start';
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        }
    }
}

export default YarnStartTarget