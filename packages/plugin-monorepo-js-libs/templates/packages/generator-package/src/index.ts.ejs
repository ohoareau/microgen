import Generator from 'yeoman-generator';
import glob from 'glob';

export default class extends Generator {
    private props: any;
    constructor(args: string|string[], options: {}) {
        super(args, options);
        this.props = {};
    }
    async prompting() {
        Object.assign(this.props, await this.prompt([
            {
                name: 'packageName',
                type: 'input',
                message: 'Package name:',
                required: true,
            },
            {
                name: 'packageDescription',
                type: 'input',
                message: 'Package description:',
                required: true,
            },
        ]));
    }
    writing() {
        this.props.react = false;
        if (/^react-/.test(this.props.packageName)) {
            this.props.react = true;
            this.props.mainComponentName = this.props.packageName.replace(/^react-/, '').split(/-/g).map(x => `${x.slice(0, 1).toUpperCase()}${x.slice(1)}`).join('');
        }
        const tplDir = this.templatePath('../../templates');
        const packageDirName = this.props.packageName;
        glob
            .sync('**', {
                cwd: tplDir,
                dot: true,
                nodir: true,
            })
            .forEach((template) => {
                if (/^_tpls\//.test(template)) return; // ignore
                const source = `${tplDir}/${template}`;
                const target = this.destinationPath(`packages/${packageDirName}/${template}`);
                this.fs.copyTpl(source, target, this.props);
            })
        ;
        if (this.props.react) {
            this.fs.copyTpl(`${tplDir}/_tpls/MainComponent.tsx`, this.destinationPath(`packages/${packageDirName}/src/${this.props.mainComponentName}.tsx`), this.props);
            this.fs.copyTpl(`${tplDir}/_tpls/index.stories.tsx`, this.destinationPath(`packages/${packageDirName}/__stories__/index.stories.tsx`), this.props);
        }
    }
}
