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
                projects: [
                    {name: 'project1', description: 'desc of project1'},
                    {name: 'project2', description: 'desc of project2', startable: true},
                    {name: 'project3', description: 'desc of project3', startable: true},
                ]
            }),
            'with-projects.md'
        );
    })
    it('with-projects-and-technos', () => {
        expectRenderSameAsFile(
            new RootReadmeTemplate({
                projects: [
                    {name: 'project2', description: 'desc of project2', startable: true},
                    {name: 'project1', description: 'desc of project1'},
                    {name: 'project3', description: 'desc of project3', startable: true},
                ],
                technologies: [
                    {name: 'techno1', link: 'https://techno1.com'},
                    {name: 'techno3', link: 'https://techno3.com'},
                    {name: 'techno4', link: 'https://techno4.com'},
                    {name: 'techno2', link: 'https://techno2.com'},
                ],
            }),
            'with-projects-and-technos.md'
        );
    })
})