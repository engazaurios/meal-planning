import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { Department } from './department.model';
import { Role } from './role.model';
import { UsersService } from './users.service';
import { Data } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: Data[];
  listSubscription: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.users = [];
    this.usersService.getAll();

    this.listSubscription = this.usersService.listChanged
      .subscribe((data: Data[]) => {
        this.users = data;
      });
  }

  onDelete(id: string) {
    this.usersService.deleteUser(id)
      .subscribe(() => this.usersService.getAll());
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }
}
