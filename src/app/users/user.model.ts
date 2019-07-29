import { Department } from './department.model';
import { Role } from './role.model';


export class User {
    public id: string;
    public name: string;
    public lastName: string;
    public birthday: Date;
    public department: Department;
    public departmentId: string;
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
        this.roles = roles || null;
        this.roleId = roleId || null;
        this.email = email || null;
        this.username = username || null;
        this.password = password || null;
        this.qrCode = qrCode || null;
        this.emailVerified = emailVerified || false;
        this.status = status || null;
        this.photo = photo || null;
    }

    get fullName() : string {
        return [this.name, this.lastName].join(' ');
    }

    get isAdmin() : boolean {
        if (!this.roles || !this.roles.length) {
            return false;
        }

        let adminRole = this.roles.find(r => r.name === 'admin');

        return adminRole ? true : false;
    }

    get permissions(): Array<string> {
        const admin = ['canManageUsers'];
        const employee = [];
        const guest = [];
        const role = this.roles && this.roles.length ? this.roles[0] : null;

        switch (role.name) {
            case 'admin':
                return admin;
            default:
                return [];
        }
    }
}