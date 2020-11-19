import {AbstractFileTemplate} from '@ohoareau/microgen';
import RouteResource from "../resources/RouteResource";

export class RoutesFileTemplate extends AbstractFileTemplate {
    protected readonly routes: RouteResource[];
    constructor(routes: RouteResource[], vars: any, cfg: any) {
        super();
        this.routes = routes;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'configs/routes.js.ejs';
    }
    getVars() {
        return {
            routes: this.routes,
        }
    }
}

export default RoutesFileTemplate