import { Department } from './department.model';
import { Role } from './role.model';

export class User {
    public name: string;
    public lastName: string;
    public username: string;
    public password: string;
    public department: Department;
    public role: Role;
    public position: string;

    constructor(name: string, department: Department, role: Role, position: string) {
        this.name = name;
        this.department = department;
        this.role = role;
        this.position = position;
    }
}