import GenericTarget from './GenericTarget';

export class TfgenTarget extends GenericTarget {
    buildSteps(options: any) {
        const {configFile = './config.json', sourceDir = 'layers', targetDir = 'environments'} = options;
        return [
            this.buildCli(
                `../node_modules/.bin/tfgen`,
                [configFile, sourceDir, targetDir],
                {},
                options
            )
        ];
    }
}

export default TfgenTarget