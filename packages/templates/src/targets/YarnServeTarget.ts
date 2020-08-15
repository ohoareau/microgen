import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnServeTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'serve';
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        }
    }
}

export default YarnServeTarget