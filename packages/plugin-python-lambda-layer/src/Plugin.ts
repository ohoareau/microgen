import {IGenerator, IPlugin} from '@ohoareau/microgen';
import Package from './Package';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerPackager('python-lambda-layer', cfg => new Package(cfg));
    }
}