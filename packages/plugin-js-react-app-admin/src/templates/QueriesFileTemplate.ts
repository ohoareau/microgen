import {AbstractFileTemplate} from '@ohoareau/microgen';
import QueryResource from "../resources/QueryResource";

export class QueriesFileTemplate extends AbstractFileTemplate {
    protected readonly queries: QueryResource[];
    constructor(queries: QueryResource[], vars: any, cfg: any) {
        super();
        this.queries = queries;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'queries.js.ejs';
    }
    getVars() {
        return {
            queries: this.queries,
        }
    }
}

export default QueriesFileTemplate