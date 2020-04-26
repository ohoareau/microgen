import ejs from 'ejs';
const fs = require('fs');
import stringifyObject from 'stringify-object';
const fse = require('fs-extra');
const path = require('path');

export const jsStringify = (o, inline = false, indentSize = 4) => stringifyObject(o, {indent: ''.padEnd(indentSize), singleQuotes: true, inlineCharacterLimit: 'number' !== typeof inline ? undefined : inline});
export const indent = (t, offset = 4) => (t || '').split(/\n/g).map(x => `${x ? ''.padEnd(offset) : ''}${x}`).join("\n");
export const render = (string, vars = {}, options = {}) => ejs.render(string, {indent, jsStringify, ...vars}, options);
export const renderFile = ({templatePath}) => (path, vars = {}) => {
    const filename = `${templatePath}/${path}`;
    return render(fs.readFileSync(filename, 'utf8'), vars, {filename});
};
export const copy = (source, target) => {
    fse.copySync(source, target);
    return true;
};
export const writeFile = (target, content) => {
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content);
    return true;
};