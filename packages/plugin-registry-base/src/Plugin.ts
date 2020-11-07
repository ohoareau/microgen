import {IGenerator, IPlugin} from '@ohoareau/microgen';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerRegistry('directory', {path: `${__dirname}/../assets`});
    }
}
