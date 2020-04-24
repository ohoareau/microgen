import Generator from './Generator';

export * from './IGenerator';
export * from './Generator';
export * from './IPackage';
export * from './IPlugin';
export * from './AbstractPackage';

const fs = require('fs-extra');
const path = require('path');

export default async (cwd, configFile = './microgen.js', targetDir = './packages', vars: any = {}) => {
    const configFileRealPath = fs.realpathSync(configFile);
    return await new Generator({
        ...require(configFileRealPath),
        rootDir: cwd,
    }).generate({
        targetDir,
        write: true,
        configFileDir: path.dirname(configFileRealPath),
        ...vars,
    });
}