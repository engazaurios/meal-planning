import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { Department } from './department.model';
import { Role } from './role.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  users: User[];

  constructor() { }

  ngOnInit() {
    this.users = [
      new User('Cesar Luis', new Department(1, 'Informatica'), new Role(1, 'Administrador'), 'Algo 1'),
      new User('Boris Becerra', new Department(2, 'Informatica'), new Role(1, 'Operario'), 'Algo 2'),
      new User('Henzer Garcia', new Department(3, 'Informatica'), new Role(1, 'Operario'), 'Algo 3'),
    ];
  }

}
