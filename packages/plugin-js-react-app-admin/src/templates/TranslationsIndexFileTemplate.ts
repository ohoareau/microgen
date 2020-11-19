import {AbstractFileTemplate} from '@ohoareau/microgen';
import TranslationResource from "../resources/TranslationResource";

export class TranslationsIndexFileTemplate extends AbstractFileTemplate {
    protected readonly translations: TranslationResource[];
    constructor(translations: TranslationResource[], vars: any, cfg: any) {
        super();
        this.translations = translations;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'configs/translations/index.js.ejs';
    }
    getVars() {
        return {
            translations: this.translations,
        }
    }
}

export default TranslationsIndexFileTemplate