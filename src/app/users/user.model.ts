export class User {
    public name: string;
    public lastName: string;
    public username: string;
    public password: string;
    public department: string;
    public position: string;

    constructor(name: string, department: string, position: string) {
        this.name = name;
        this.department = department;
        this.position = position;
    }
}