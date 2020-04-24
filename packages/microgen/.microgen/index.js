class Package {
    name = 'mylocaltype';
    generate() {
        return {
            ['dir1/file1.txt']: () => 'This is the content of the file',
        };
    }
}
module.exports = class Plugin {
    register(g) {
        g.registerPackager('mylocaltype', () => new Package());
    }
}