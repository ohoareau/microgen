import IPlugin from '../../IPlugin';
import Package from './Package';
import IGenerator from '../../IGenerator';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerPackager('files', cfg => new Package(cfg));
    }
}