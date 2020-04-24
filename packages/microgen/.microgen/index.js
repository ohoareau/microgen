class Package {
    constructor(config) {
        this.name = config.name;
        this.packageType = config.packageType;
    }
    generate() {
        return {
            ['dir1/file1.txt']: () => 'This is the content of the file',
        };
    }
}
module.exports = class Plugin {
    register(g) {
        g.registerPackager('mylocaltype', c => new Package(c));
    }
}