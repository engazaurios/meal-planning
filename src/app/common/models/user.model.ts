import { Department } from './department.model';
import { CostCenter } from './cost-center.model';
import { Role } from './role.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../_helpers/constants';
import * as moment from 'moment';


export class User {
    public id: string;
    public name: string;
    public lastName: string;
    public birthday: Date;
    public birthdayNgbDate: NgbDate;
    public department: Department;
    public departmentId: string;
    public costCenter: CostCenter;
    public costCenterId: string;
    public roles: Role[];
    public roleId: string;
    public email: string;
    public username: string;
    public password: string;
    public qrCode: string;
    public emailVerified: boolean;
    public status: string;
    public photo: string;

    constructor(values : Object = {}) {
        this.id = null;
        this.name = null;
        this.lastName = null;
        this.birthday = null;
        this.department = null;
        this.departmentId = null;
        this.costCenter = null;
        this.costCenterId = null;
        this.roles = [];
        this.roleId = null;
        this.email = null;
        this.username = null;
        this.password = null;
        this.qrCode = null;
        this.emailVerified = false;
        this.status = null;
        this.photo = null;

        Object.keys(values).forEach(key => {
            if (!this.hasOwnProperty(key)) {
              return;
            }

            if (key === 'birthday') {
              let birthday = moment(values[key]);

              if (birthday.isValid()) {
                this.birthday = birthday.toDate();
                this.birthdayNgbDate = new NgbDate(
                  birthday.year(),
                  birthday.month() + 1,
                  birthday.date()
                );
              }
            }
            else if ((key === 'roles') && Array.isArray(values[key])) {
              this.roles = values[key].map((roleData: Role) => new Role(roleData.id, roleData.name));
            }
            else {
              this[key] = values[key];
            }
        });
    }

    get role() : Role {
        return this.roles.length ? this.roles[0] : null;
    }

    get fullName() : string {
        return [this.name, this.lastName].join(' ');
    }

    get isAdmin() : boolean {
        let adminRole = this.roles.find(r => r.name === Constants.userTypes.ADMIN.key);

        return adminRole ? true : false;
    }

    get isProvider() : boolean {
        let providerRole = this.roles.find(r => r.name === Constants.userTypes.PROVIDER.key);

        return providerRole ? true : false;
    }

    get permissions(): Array<string> {
        const admin = ['canManageUsers'];
        const employee = [];
        const guest = [];

        if (!this.role) {
            return [];
        }

        switch (this.role.name) {
            case Constants.userTypes.ADMIN.key:
                return admin;
            default:
                return [];
        }
    }
}
