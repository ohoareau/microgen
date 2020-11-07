import {IGenerator, IPlugin} from '../..';
import Registry from "./Registry";

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerRegistryFactory('directory', cfg => new Registry(cfg));
    }
}
