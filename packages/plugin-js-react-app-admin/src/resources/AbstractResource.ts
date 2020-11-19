export abstract class AbstractResource {
    protected constructor() {
    }
    toString() {
        return JSON.stringify(this.serialize());
    }
    serialize() {
        return {};
    }
    protected buildComponentName(name: string, type: string): string {
        return `${this.realCamelCase(name)}${this.realCamelCase(type)}`;
    }
    protected realCamelCase(text: string) {
        return text.split(/_/g).map(x => `${x.slice(0, 1).toUpperCase()}${x.slice(1)}`).join('');
    }
}

export default AbstractResource