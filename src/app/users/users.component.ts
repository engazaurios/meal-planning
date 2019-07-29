import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { Department } from './department.model';
import { Role } from './role.model';
import { UsersService } from './users.service';
import { Router, Data } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  listSubscription: Subscription;

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit() {
    this.users = [];
    this.usersService.fetchAll();

    this.listSubscription = this.usersService.listChanged
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  onEdit(id: string) {
    this.router.navigate([`/users/${id}`]);
  }

  onDelete(id: string) {
    this.usersService.deleteUser(id)
      .subscribe(() => this.usersService.fetchAll());
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }
}
