import { Department } from './department.model';
import { Role } from './role.model';

export class User {
    public id: string;
    public name: string;
    public lastName: string;
    public birthday: Date;
    public department: Department;
    public role: Role;
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
        role?: Role,
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
        this.role = role || null;
        this.email = email || null;
        this.username = username || null;
        this.password = password || null;
        this.qrCode = qrCode || null;
        this.emailVerified = emailVerified || false;
        this.status = status || null;
        this.photo = photo || null;
    }
}