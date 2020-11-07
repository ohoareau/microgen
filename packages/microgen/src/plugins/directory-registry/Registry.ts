import {AbstractRegistry, asset} from '../..';
import {existsSync, readFileSync} from 'fs';
import YAML from 'yaml';

export default class Registry extends AbstractRegistry<{path: string}> {
    hasAsset(type: string, name: string) {
        return existsSync(this.getAssetPath(type, name));
    }
    getAsset(type: string, name: string): asset {
        return YAML.parse(readFileSync(this.getAssetPath(type, name), 'utf8'), {prettyErrors: true});
    }
    getAssetPath(type: string, name: string): string {
        return `${this.getAssetsRoot()}/${type}/${name}.yml`;
    }
    protected getAssetsRoot(): string {
        return this.config['path'] || './assets';
    }
}