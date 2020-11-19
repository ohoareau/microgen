import {AbstractFileTemplate} from '@ohoareau/microgen';
import ThemeResource from "../resources/ThemeResource";

export class ThemeFileTemplate extends AbstractFileTemplate {
    protected readonly theme: ThemeResource;
    constructor(theme: ThemeResource, vars: any, cfg: any) {
        super();
        this.theme = theme;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'configs/themes/theme.js.ejs';
    }
    getVars() {
        return {
            theme: this.theme,
        }
    }
}

export default ThemeFileTemplate