import {AbstractFileTemplate} from '@ohoareau/microgen';
import ThemeResource from "../resources/ThemeResource";

export class ThemesIndexFileTemplate extends AbstractFileTemplate {
    protected readonly themes: ThemeResource[];
    constructor(themes: ThemeResource[], vars: any, cfg: any) {
        super();
        this.themes = themes;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'configs/themes/index.js.ejs';
    }
    getVars() {
        return {
            themes: this.themes,
        }
    }
}

export default ThemesIndexFileTemplate