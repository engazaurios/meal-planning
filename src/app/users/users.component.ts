import { Component, OnInit } from '@angular/core';
import { User } from './user.model';

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
      new User('Cesar Luis', 'Informatica', 'Algo 1'),
      new User('Boris Becerra', 'Informatica', 'Algo 2'),
      new User('Henzer Garcia', 'Informatica', 'Algo 3'),
    ];
  }

}
