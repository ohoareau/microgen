import {IGenerator, IPlugin} from '@ohoareau/microgen';
import Package from './Package';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerPackager('js-docker-image', cfg => new Package(cfg));
    }
}