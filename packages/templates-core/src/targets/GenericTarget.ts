export class GenericTarget {
    public name: string;
    public steps: string[];
    public dependencies: string[];
    constructor({name, steps = [], dependencies = [], options = {}}: {name: string, steps?: string[], dependencies?: string[], options?: any}) {
        this.name = name;
        options = this.buildOptions(options);
        const localSteps = [...this.buildSteps(options), ...steps].filter(x => !!x) as string[];
        this.dependencies = [...this.buildDependencies(options), ...dependencies].filter(x => !!x) as string[];
        this.steps = this.convertSteps(this.dependencies.length ? localSteps : (localSteps.length ? localSteps : ['true']), options);
    }
    buildOptions(options: any): any {
        return options;
    }
    buildSteps(options: any): (string|false)[] {
        return [];
    }
    buildDependencies(options: any): (string|false)[] {
        return [];
    }
    buildCliOptions(opts: any, options: any): string {
        return Object.entries(opts).reduce((acc, [k, v]) => {
            if (undefined === v) return acc;
            const x = (k.length > 1) ? '--' : '-';
            const vv = Array.isArray(v) ? v : [v];
            if (0 === vv.length) return acc;
            return vv.reduce((acc2, vvv) => {
                const value = true === vvv ? '' : String(vvv);
                return `${acc2 || ''}${acc2 ? ' ' : ''}${x}${k}${value ? ' ' : ''}${value || ''}`;
            }, acc);
        }, '');
    }
    buildCliArgs(args: any, options: any): string {
        return args.reduce((acc, v) => {
            if (undefined === v) return acc;
            return `${acc || ''}${acc ? ' ' : ''}${v}`;
        }, '');
    }
    buildCli(command: string, args: (string|undefined)[], opts: any, options: any, preOpts: any = {}): string {
        const a = this.buildCliArgs(args, options)
        const o = this.buildCliOptions(opts, options)
        const po = this.buildCliOptions(preOpts, options)
        return `${command}${po ? ' ' : ''}${po || ''}${a ? ' ' : ''}${a || ''}${o ? ' ' : ''}${o || ''}`;
    }
    convertSteps(steps: string[], options: any): string[] {
        options.dir && (steps = steps.map(s => `cd ${options.dir} && ${s}`));
        options.awsProfile && (steps = steps.map(s => `AWS_PROFILE=${options.awsProfile} ${s}`));
        options.ci && (steps = steps.map(s => `CI=true ${s}`));
        steps = steps.map(s => (s.slice(0, 1) === '@') ? s : `@${s}`);
        return steps;
    }
}

export default GenericTarget