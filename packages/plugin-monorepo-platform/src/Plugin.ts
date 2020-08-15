import Package from './Package';
import {IGenerator, IPlugin, IPackage} from '@ohoareau/microgen';
import {buildProjectsVars} from "./utils";

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
        const {startableProjects} = buildProjectsVars({projects: ctx.data.projects});
        startableProjects.forEach((p, i) => {
            ctx.data.projects[p.name].startableOrder = i;
        })
    }
    onProjectHydrate(p: IPackage, eventType: string, ctx: any): void {
        if ('monorepo-platform' === p.getPackageType()) return;
        if (!ctx.globalContext.projects[p.getName()]) return;
        Object.entries(ctx.globalContext.projects[p.getName()]).forEach(([k, v]) => {
            if (!ctx.data || !ctx.data.projectData) return;
            if ('undefined' !== typeof ctx.data.projectData[k]) return;
            ctx.data.projectData[k] = v;
        }) ;
    }
    register(generator: IGenerator): void {
        generator.registerPackageEventHook('*', 'created', this.onPackageCreated);
        generator.registerPackageEventHook('*', 'before_hydrate', this.onProjectHydrate);
        generator.registerPackageEventHook('monorepo-platform', 'before_hydrate', this.onMonorepoPlatformHydrate);
        generator.registerPackager('monorepo-platform', cfg => new Package(cfg));
    }
}
