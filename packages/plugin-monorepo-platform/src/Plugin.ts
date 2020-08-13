import Package from './Package';
import {IGenerator, IPlugin, IPackage} from '@ohoareau/microgen';

export default class Plugin implements IPlugin {
    onPackageCreated(p: IPackage, eventType: string, ctx: {data: any, globalContext: any}): void {
        if ('.' === p.getName()) return;
        ctx.globalContext.projects = ctx.globalContext.projects || {};
        const features = {
            startable: false,
            testable: false,
            deployable: false,
            preInstallable: false,
            ...p.getFeatures(),
        };
        const extraOptions = {
            ...p.getExtraOptions(),
        }
        ctx.globalContext.projects[p.getName()] = {
            name: p.getName(),
            description: p.getDescription(),
            ...features,
            ...extraOptions,
        };
    }
    onMonorepoPlatformHydrate(p: IPackage, eventType: string, ctx: any): void {
        ctx.data.projects = {...(ctx.globalContext.projects || {}), ...(ctx.data.projects || {})};
    }
    register(generator: IGenerator): void {
        generator.registerPackageEventHook('*', 'created', this.onPackageCreated);
        generator.registerPackageEventHook('monorepo-platform', 'before_hydrate', this.onMonorepoPlatformHydrate);
        generator.registerPackager('monorepo-platform', cfg => new Package(cfg));
    }
}
