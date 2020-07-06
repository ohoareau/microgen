export interface ITemplate {
    render(helpers?: {[key: string]: any}): string;
}

export const isTemplate = (value: any): value is ITemplate => {
    return (value as ITemplate).render !== undefined;
};

export default ITemplate