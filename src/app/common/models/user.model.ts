import { Department } from './department.model';
import { CostCenter } from './cost-center.model';
import { Role } from './role.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../_helpers/constants';


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

    constructor();
    constructor(
        id?: string,
        name?: string,
        lastName?: string,
        birthday?: Date,
        department?: Department,
        departmentId?: string,
        costCenter?: CostCenter,
        costCenterId?: string,
        roles?: Role[],
        roleId?: string,
        email?: string,
        username?: string,
        password?: string,
        qrCode?: string,
        emailVerified?: boolean,
        status?: string,
        photo?: string
    ) {
        this.id = id || null;
        this.name = name || null;
        this.lastName = lastName || null;
        this.birthday = birthday || null;
        this.department = department || null;
        this.departmentId = departmentId || null;
        this.costCenter = costCenter || null;
        this.costCenterId = costCenterId || null;
        this.roles = roles || [];
        this.roleId = roleId || null;
        this.email = email || null;
        this.username = username || null;
        this.password = password || null;
        this.qrCode = qrCode || null;
        this.emailVerified = emailVerified || false;
        this.status = status || null;
        this.photo = photo || null;

        if (this.birthday) {
            this.birthdayNgbDate = new NgbDate(
                this.birthday.getFullYear(),
                this.birthday.getMonth() + 1,
                this.birthday.getDate()
            );
        }
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
