import {config, schema} from "./types";

export class ConfigLoader {
    constructor() {
    }
    load(config: config): any {
        config = {types: {}, ...config};
        const schema: schema = {
            forms: [],
            screens: [],
            menuitems: [],
            actions: [],
            queries: [],
            themes: [],
            translations: [],
            routes: [],
        };
        this.loadForms(config, schema);
        this.loadScreens(config, schema);
        this.loadMenuitems(config, schema);
        this.loadActions(config, schema);
        this.loadQueries(config, schema);
        this.loadThemes(config, schema);
        this.loadTranslations(config, schema);
        this.loadRoutes(config, schema);
        return schema;
    }
    protected reduceTypes<T = any>(config: config, reducer: (acc: T, name: string, type: any) => T, defaultValue: T = [] as any) {
        return Object.entries(config.types).reduce((acc, [k, v]) => reducer(acc, k, v), defaultValue)
    }
    protected loadForms(config: config, schema: schema) {
        this.reduceTypes(config, (acc, name, type) => {
            acc.push({name: `create_${name}`, package: name, type: 'create', fields: []})
            acc.push({name: `edit_${name}`, package: name, type: 'edit', fields: []})
            acc.push({name: `display_${name}`, package: name, type: 'display', fields: []})
            return acc;
        }, schema.forms);
    }
    protected loadScreens(config: config, schema: schema) {
        return this.reduceTypes(config, (acc, name, type) => {
            acc.push({name: `create_${name}`, package: name, type: 'create', fields: []})
            acc.push({name: `edit_${name}`, package: name, type: 'edit', fields: []})
            acc.push({name: `display_${name}`, package: name, type: 'display', fields: []})
            acc.push({name: `list_${type.pluralName || `${name}s`}`, package: name, type: 'list', fields: []})
            return acc;
        }, schema.screens);
    }
    protected loadMenuitems(config: config, schema: schema) {
    }
    protected loadActions(config: config, schema: schema) {
    }
    protected loadQueries(config: config, schema: schema) {
    }
    protected loadThemes(config: config, schema: schema) {
        schema.themes.push({name: 'theme1'});
    }
    protected loadTranslations(config: config, schema: schema) {
        schema.translations.push({name: 'fr'});
        schema.translations.push({name: 'en'});
    }
    protected loadRoutes(config: config, schema: schema) {
    }
}

export default ConfigLoader