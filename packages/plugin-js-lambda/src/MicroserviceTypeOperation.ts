import Handler from './Handler';
import MicroserviceType from './MicroserviceType';

export type MicroserviceTypeOperationConfig = {
    microserviceType: MicroserviceType,
    name: string,
    type: string|undefined,
    middlewares: string[],
    backend: string|{name: string, method?: string, args?: string[], [key: string]: any},
    vars: {[key: string]: any},
    prefetch: string[],
    hooks: {[key: string]: any[]},
    handler: boolean,
    wrap?: any,
};

export default class MicroserviceTypeOperation {
    public readonly name: string;
    public readonly handler?: Handler;
    public readonly microserviceType: MicroserviceType;
    constructor(microserviceType, {name, type = undefined, handler = true, middlewares = [], backend, vars = {}, hooks = {}, prefetch = []}: MicroserviceTypeOperationConfig) {
        this.microserviceType = microserviceType;
        this.name = name;
        this.handler = handler ? new Handler({name: `${microserviceType.name}_${this.name}`, type: 'service', middlewares, directory: 'handlers', params: {
                on: this.name,
                m: microserviceType.name,
                b: backend,
            }, vars: {
                ...vars,
                service: `crud/${microserviceType.name}`,
                method: type || name,
                paramsKey: true,
                configureService: false,
            }}) : undefined;
        const model = microserviceType.model;
        const registerReferenceEventListener = (v, operation, listener) =>
            microserviceType.microservice.package.registerEventListener(
                `${(<any>v).reference.replace(/\./g, '_')}${/\./.test((<any>v).reference) ? '' : `_${microserviceType.microservice.name}`}_${operation}`,
                listener
            )
        ;
        switch (name) {
            case 'create':
                this.hasHooks('validate', name, microserviceType) && microserviceType.registerHook(name, 'validate', {type: '@validate', config: {}});
                this.hasHooks('transform', name, microserviceType) && microserviceType.registerHook(name, 'transform', {type: '@transform', config: {}});
                this.hasHooks('populate', name, microserviceType) && microserviceType.registerHook(name, 'populate', {type: '@populate', config: {}});
                this.hasHooks('prepare', name, microserviceType) && microserviceType.registerHook(name, 'prepare', {type: '@prepare', config: {}});
                this.hasHooks('after', name, microserviceType) && microserviceType.registerHook(name, 'after', {type: '@after', config: {}});
                this.hasHooks('autoTransitionTo', name, microserviceType) && microserviceType.registerHook(name, 'end', {type: '@auto-transitions', config: {}});
                break;
            case 'update':
                this.hasHooks('prefetch', name, microserviceType) && microserviceType.registerHook(name, 'init', {type: '@prefetch'});
                this.hasHooks('validate', name, microserviceType) && microserviceType.registerHook(name, 'validate', {type: '@validate', config: {required: false}});
                this.hasHooks('transform', name, microserviceType) && microserviceType.registerHook(name, 'transform', {type: '@transform', config: {}});
                this.hasHooks('populate', name, microserviceType) && microserviceType.registerHook(name, 'populate', {type: '@populate', config: {prefix: 'update'}});
                this.hasHooks('prepare', name, microserviceType) && microserviceType.registerHook(name, 'prepare', {type: '@prepare', config: {}});
                this.hasHooks('after', name, microserviceType) && microserviceType.registerHook(name, 'after', {type: '@after', config: {}});
                Object.entries(model.referenceFields || {}).forEach(([k, v]: [string, any]) =>
                    registerReferenceEventListener(v, 'update', {
                        type: '@update-references',
                        config: {
                            name: microserviceType.name,
                            key: k,
                            idField: v.idField
                        },
                    })
                );
                break;
            case 'delete':
                this.hasHooks('prefetch', name, microserviceType) && microserviceType.registerHook(name, 'init', {type: '@prefetch'});
                Object.entries(model.referenceFields || {}).forEach(([k, v]: [string, any]) =>
                    registerReferenceEventListener(v, 'delete', {
                        type: '@delete-references',
                        config: {
                            name: microserviceType.name,
                            key: k,
                            idField: v.idField
                        },
                    })
                );
                break;
            default:
                break;
        }
        Object.entries(hooks).forEach(([k, v]) => {
            v.forEach(h => microserviceType.registerHook(this.name, k, h));
        });
    }
    hasHooks(type: string, operation: string, microserviceType: MicroserviceType): boolean {
        switch (type) {
            case 'prefetch':
                return !!Object.keys(microserviceType.model.prefetchs).length;
            case 'validate':
                return !!Object.keys(microserviceType.model.fields).length;
            case 'transform':
                return !!Object.keys(microserviceType.model.transformers).length;
            case 'populate':
                switch (operation) {
                    case 'create':
                        return !!Object.keys(microserviceType.model.values).length || !!Object.keys(microserviceType.model.defaultValues).length;
                    case 'update':
                        return !!Object.keys(microserviceType.model.updateValues).length || !!Object.keys(microserviceType.model.updateDefaultValues).length;
                    default:
                        return false;
                }
            case 'prepare':
                return !!Object.keys(microserviceType.model.volatileFields).length;
            case 'after':
                return !!Object.keys(microserviceType.model.volatileFields).length;
            case 'autoTransitionTo':
                return !!Object.keys(microserviceType.model.autoTransitionTo).length;
            default:
                return false;
        }
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        return this.handler ? this.handler.generate(vars) : Promise.resolve({});
    }
}