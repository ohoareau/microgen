import RootReadmeTemplate from "../src/RootReadmeTemplate";
import path from "path";

const expectRenderSameAsFile = (template: RootReadmeTemplate, file: string) => {
    expect(template.render().trimRight()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/root-readmes/${file}`), 'utf8').trim());
};

describe('RootReadmeTemplate', () => {
    it('empty', () => {
        expectRenderSameAsFile(new RootReadmeTemplate(), 'empty.md');
    })
    it('with-projects', () => {
        expectRenderSameAsFile(
            new RootReadmeTemplate({
                projects: {
                    project1: {description: 'desc of project1', installable: true, buildable: true, testable: true},
                    project2: {description: 'desc of project2', installable: true, buildable: true, testable: true, startable: true, deployable: true},
                    project3: {description: 'desc of project3', installable: true, buildable: true, testable: true, startable: true},
                }
            }),
            'with-projects.md'
        );
    })
    it('with-projects-and-technos', () => {
        expectRenderSameAsFile(
            new RootReadmeTemplate({
                projects: {
                    project2: {description: 'desc of project2', installable: true, buildable: true, testable: true, startable: true, deployable: true},
                    project1: {description: 'desc of project1', installable: true, buildable: true, testable: true, deployable: true},
                    project3: {description: 'desc of project3', installable: true, buildable: true, testable: true, startable: true},
                },
                technologies: {
                    techno1: {link: 'https://techno1.com'},
                    techno3: {link: 'https://techno3.com'},
                    techno4: {link: 'https://techno4.com'},
                    techno2: {link: 'https://techno2.com'},
                },
                preRequisites: {
                    aa: {name: 'Aa', type: 'inline', content: 'This is the content'},
                },
            }),
            'with-projects-and-technos.md'
        );
    })
})