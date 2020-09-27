import * as fieldTypes from './fieldTypes';

export default class SchemaParser {
    public readonly fieldTypes: {[key: string]: Function} = {};
    constructor() {
        Object.entries(fieldTypes).forEach(([k, v]) => this.fieldTypes[k] = v);
    }
    parse(def: any): any {
        def = {name: 'unknown', attributes: {}, operations: {}, indexes: {}, hooks: {}, ...def};
        const schema = {
            primaryKey: <any>undefined,
            fields: {},
            privateFields: {},
            requiredFields: {},
            validators: {},
            values: {},
            updateValues: {},
            defaultValues: {},
            updateDefaultValues: {},
            indexes: {},
            volatileFields: {},
            transformers: {},
            referenceFields: {},
            refAttributeFields: {},
            hooks: def.hooks,
            name: def.name,
            prefetchs: {},
            autoTransitionTo: {},
            cascadeValues: {},
            authorizers: {},
        };
        this.parseAttributes(def, schema);
        this.parseRefAttributeFields(def, schema);
        this.parseIndexes(def, schema);
        this.parseJob(def, schema);
        this.parseOperations(def, schema);
        return schema;
    }
    parseOperations(def: any, schema: any) {
        Object.entries(def.operations).reduce((acc, [k, d]) => {
            if (!d || !(<any>d)['prefetch']) return acc;
            Object.assign(acc.prefetchs[k] = acc.prefetchs[k] || {}, (<any>d).prefetch.reduce((acc2, k) => Object.assign(acc2, {[k]: true}), {}));
            return acc;
        }, schema);
    }
    parseIndexes(def: any, schema: any) {
        Object.entries(def.indexes || {}).reduce((acc, [k, v]) => {
            acc.indexes[k] = [...(acc.indexes[k] || []), ...<any>v];
            return acc;
        }, schema);
    }
    parseAttributes(def: any, schema: any) {
        Object.entries(def.attributes).reduce((acc, [k, d]) => {
            d = {
                ...('string' === typeof d) ? this.parseFieldString(d, k) : d,
            };
            const forcedDef: any = {...(<any>d || {})};
            delete forcedDef.config;
            delete forcedDef.type;
            let officialDef = this.createField(d);
            const def = {
                ...officialDef,
                ...forcedDef,
                validators: [].concat(officialDef.validators || [], forcedDef.validators || []),
            };
            const {
                type = 'string', prefetch = false, list = false, volatile = false, required = false, index = [], internal = false, validators = undefined, primaryKey = false,
                value = undefined, default: rawDefaultValue = undefined, defaultValue = undefined, updateValue = undefined, updateDefault: rawUpdateDefaultValue = undefined, updateDefaultValue = undefined,
                upper = false, lower = false, transform = undefined, reference = undefined, refAttribute = undefined,
                autoTransitionTo = undefined, cascadePopulate = undefined, permissions = undefined, authorizers = [],
            } = def;
            acc.fields[k] = {
                type, primaryKey, volatile,
                ...((index && index.length > 0) ? {index} : {}),
                ...(list ? {list} : {}),
            };
            acc.transformers[k] = transform ? (Array.isArray(transform) ? [...transform] : [transform]) : [];
            required && (acc.requiredFields[k] = true);
            if (refAttribute) {
                if (!acc.refAttributeFields[refAttribute.parentField]) acc.refAttributeFields[refAttribute.parentField] = [];
                acc.refAttributeFields[refAttribute.parentField].push({
                    sourceField: refAttribute.sourceField,
                    targetField: k,
                    field: refAttribute.field
                });
            }
            (undefined !== reference) && (acc.referenceFields[k] = reference);
            (validators && 0 < validators.length) && (acc.validators[k] = validators);
            (authorizers && 0 < authorizers.length) && (acc.authorizers[k] = authorizers);
            (undefined !== value) && (acc.values[k] = value);
            (undefined !== updateValue) && (acc.updateValues[k] = updateValue);
            (undefined !== defaultValue) && (acc.defaultValues[k] = defaultValue);
            (undefined !== rawDefaultValue) && (acc.defaultValues[k] = {type: '@value', config: {value: rawDefaultValue}});
            (undefined !== updateDefaultValue) && (acc.updateDefaultValues[k] = updateDefaultValue);
            (undefined !== rawUpdateDefaultValue) && (acc.updateDefaultValues[k] = {type: '@value', config: {value: rawUpdateDefaultValue}});
            (undefined !== autoTransitionTo) && (acc.autoTransitionTo[k] = {type: '@value', config: {value: autoTransitionTo}});
            (undefined !== cascadePopulate) && (acc.cascadeValues[k] = cascadePopulate);
            (undefined !== permissions) && (acc.authorizers[k].push({type: '@permissions', config: {permissions}}));
            internal && (acc.privateFields[k] = true);
            index && (index.length > 0) && (acc.indexes[k] = index);
            volatile && (acc.volatileFields[k] = true);
            primaryKey && (acc.primaryKey = k);
            upper && (acc.transformers[k].push({type: '@upper'}));
            lower && (acc.transformers[k].push({type: '@lower'}));
            prefetch && ((acc.prefetchs['update'] = acc.prefetchs['update'] || {})[k] = true);
            if (!acc.transformers[k].length) delete acc.transformers[k];
            if (!acc.authorizers[k].length) delete acc.authorizers[k];
            return acc;
        }, schema);
    }
    parseRefAttributeFields(def: any, schema: any) {
        Object.entries(schema.refAttributeFields).forEach(([k, vList]) => {
            const x = (<any[]>vList).reduce((acc, v) => {
                acc.sourceFields[v.sourceField] = true;
                acc.targetFields[v.targetField] = true;
                acc.values[v.targetField] = acc.updateValues[v.targetField] = {
                    type: '@ref-attribute-field',
                    config: {
                        key: k,
                        prefix: this.buildTypeName(schema.referenceFields[k].reference, schema.name),
                        sourceField: v.sourceField,
                    }
                };
                return acc;
            }, {targetFields: [], sourceFields: [], values: [], updateValues: []});
            if (!schema.referenceFields[k]) throw new Error(`${k} is not a reference field (but is a ref attribute requirement for ${Object.keys(x.targetFields).join(', ')})`);
            if (!schema.validators[k]) schema.validators[k] = [];
            schema.referenceFields[k].fetchedFields = ['id'].concat(schema.referenceFields[k].fetchedFields, Object.keys(x.sourceFields));
            Object.assign(schema.values, x.values);
            Object.assign(schema.updateValues, x.updateValues);
        });
        Object.keys(schema.referenceFields).forEach(k => {
            if (!schema.validators[k]) schema.validators[k] = [];
            schema.validators[k].push(
                this.buildReferenceValidator(schema.referenceFields[k], k, schema.name)
            );
        });
    }
    parseJob(def: any, schema: any) {
        /*
        const operations = {
            delete: {complete: 'delete', virtualComplete: true},
            create: {},
            update: {},
        };
        Object.entries(operations).forEach(([operation, operationDef]) => {
            const key = `${operation}Job`;
            if (!def[key]) return;
            const mode = {pendingInput: () => ({}), completeInput: () => ({}), failureInput: () => ({}), ...def[key]};
            registerEventListener(c, `${c.type}_${operation}_complete`, async (payload, { config: { operation } }) =>
                operation(`${c.type}.${(<any>operationDef).complete || 'update'}`, {params: {id: payload.id, complete: true, input: {...(await mode.completeInput(payload))}}})
            );
            registerEventListener(c, `${c.type}_${operation}_failure`, async (payload, { config: { operation } }) =>
                operation(`${c.type}.${(<any>operationDef).failure || 'update'}`, {params: {id: payload.id, input: {...(await mode.failureInput(payload))}}})
            );
            if ((<any>operationDef).virtualComplete) {
                registerOperation(c, operation, c => async (payload) =>
                    c.operation(`${c.type}.update`, {params: {id: payload.id, input: {...(await mode.pendingInput(payload))}}})
                );
                registerOperation(c, `complete_${operation}`, () => async (payload, options, process) =>
                    process(operation)
                );
            } else {
                c.registerHooks([
                    [`populate_${operation}`, async action => {
                        Object.assign(action.req.payload.data, await mode.pendingInput(action.req.payload));
                    }],
                ]);
            }
        });
         */
    }
    parseFieldString(string, name): any {
        const d = {
            type: string, config: {},
            internal: false, required: false, primaryKey: false, volatile: false,
            reference: <any>undefined, refAttribute: <any>undefined, validators: [],
            index: <any>[], value: <any>undefined,
        };
        if (/!$/.test(d.type)) {
            d.required = true;
            d.type = d.type.substr(0, d.type.length - 1);
        }
        if (/^&/.test(d.type)) {
            d.primaryKey = true;
            d.type = d.type.substr(1);
        }
        if (/^:/.test(d.type)) {
            d.internal = true;
            d.type = d.type.substr(1);
        }
        if (/^#/.test(d.type)) {
            d.volatile = true;
            d.type = d.type.substr(1);
        }
        if (/^@/.test(d.type)) {
            d.type = d.type.substr(1);
            d.index.push({name});
        }
        if (/^user_ref:/.test(d.type)) {
            d.type = d.type.substr(5);
            d.value = {type: '@user_id'};
        }
        if (/^ref:/.test(d.type)) {
            const tokens = d.type.substr(4).split(':');
            d.reference = {
                reference: tokens[0],
                idField: tokens[1] || 'id',
                fetchedFields: [],
            };
            d.type = 'string';
        }
        if (/^refattr:/.test(d.type)) {
            const [parentField, sourceField] = d.type.substr(8).split(/:/);
            d.refAttribute = {
                parentField,
                sourceField,
                field: name,
            };
            d.type = 'string';
        }
        return d;
    }
    createField(def: any) {
        let tt = def.type;
        const extra = <any>{};
        if (Array.isArray(tt)) {
            extra.type = tt;
            tt = tt[0].type;
        }
        if ('object' === typeof tt) {
            extra.type = tt;
            tt = 'object';
        }
        return {...this.getFieldType(tt)((def || {}).config || {}), ...extra};
    }
    getFieldType(name: string): Function {
        if (!this.fieldTypes[name]) {
            throw new Error(`Unknown field type '${name}'`);
        }
        return this.fieldTypes[name];
    }
    buildTypeName(type, modelName) {
        const tokens = modelName.split(/_/g);
        let fullType = type.replace(/\./g, '_');
        if (!/_/.test(fullType)) {
            tokens.pop();
            tokens.push(fullType);
            fullType = tokens.join('_');
        }
        return fullType;
    }
    buildReferenceValidator(def: {[key: string]: any}, localField: string, modelName: string) {
        return {
            type: '@reference',
            config: {
                type: this.buildTypeName(def.reference, modelName),
                localField,
                idField: def['idField'] || 'id',
                fetchedFields: def['fetchedFields'] || [],
            },
        };
    }
}