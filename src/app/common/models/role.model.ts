import { Constants } from '../../_helpers/constants';

;

export class Role {
    public id: string;
    public name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    get title() : string {
        if (!this.name) {
            return '';
        }

        const roleMap = Object.values(Constants.userTypes).find(r => r.key === this.name);

        return roleMap ? roleMap.name : '';
    }
}
