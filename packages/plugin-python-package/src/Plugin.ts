import {IGenerator, IPlugin} from '@ohoareau/microgen';
import Package from './Package';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerPackager('python-package', cfg => new Package(cfg));
    }
}
