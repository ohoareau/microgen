import {AbstractFileTemplate} from '@ohoareau/microgen';
import FormResource from "../resources/FormResource";

export class FormComponentFileTemplate extends AbstractFileTemplate {
    protected readonly form: FormResource;
    constructor(form: FormResource, vars: any, cfg: any) {
        super();
        this.form = form;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return `components/form.jsx.ejs`;
    }
    getVars() {
        return {
            form: this.form,
        }
    }
}

export default FormComponentFileTemplate