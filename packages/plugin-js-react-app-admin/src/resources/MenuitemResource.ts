import {AbstractResource} from "./AbstractResource";

export type menuitem = {
    id: string,
    path: string,
    icon: string,
};

export class MenuitemResource extends AbstractResource {
    public id: string;
    public path: string;
    public icon: string;
    constructor(config: menuitem) {
        super();
        this.id = config.id;
        this.path = config.path;
        this.icon = config.icon;
    }
    serialize() {
        return {id: this.id, path: this.path, icon: this.icon};
    }
}

export default MenuitemResource