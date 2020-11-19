import {AbstractFileTemplate} from '@ohoareau/microgen';
import MenuitemResource from "../resources/MenuitemResource";

export class MenuitemsFileTemplate extends AbstractFileTemplate {
    protected readonly menuitems: MenuitemResource[];
    constructor(menuitems: MenuitemResource[], vars: any, cfg: any) {
        super();
        this.menuitems = menuitems;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'configs/menuitems.js.ejs';
    }
    getVars() {
        return {
            menuitems: this.menuitems,
        }
    }
}

export default MenuitemsFileTemplate