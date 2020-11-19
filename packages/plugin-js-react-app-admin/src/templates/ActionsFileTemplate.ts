import {AbstractFileTemplate} from '@ohoareau/microgen';
import ActionResource from "../resources/ActionResource";

export class ActionsFileTemplate extends AbstractFileTemplate {
    protected readonly actions: ActionResource[];
    constructor(actions: ActionResource[], vars: any, cfg: any) {
        super();
        this.actions = actions;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'actions.js.ejs';
    }
    getVars() {
        return {
            actions: this.actions,
        }
    }
}

export default ActionsFileTemplate