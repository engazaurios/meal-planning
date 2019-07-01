import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { Department } from './department.model';
import { Role } from './role.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  users: User[];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.users = [];

    this.usersService.getAll()
      .subscribe((data: any) => {
        this.users = data;
      });
  }

}
