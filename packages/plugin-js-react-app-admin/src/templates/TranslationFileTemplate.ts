import {AbstractFileTemplate} from '@ohoareau/microgen';
import TranslationResource from "../resources/TranslationResource";

export class TranslationFileTemplate extends AbstractFileTemplate {
    protected readonly translation: TranslationResource;
    constructor(translation: TranslationResource, vars: any, cfg: any) {
        super();
        this.translation = translation;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'configs/translations/translation.js.ejs';
    }
    getVars() {
        return {
            translation: this.translation,
        }
    }
}

export default TranslationFileTemplate