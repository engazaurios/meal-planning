import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from './users.service';
import { FileUploaderService } from '../file-uploader.service';
import { User } from './user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit, OnDestroy {
  currentTime: number;
  users: User[];
  listSubscription: Subscription;
  pageActions: Array<Object> = [
    {
      text: 'Agregar',
      buttonType: 'btn btn-success',
      icon: 'fa fa-plus',
      route: '/users/new',
    },
  ];

  constructor(
    private router: Router,
    private usersService: UsersService,
    private fileUploader: FileUploaderService
  ) { }

  ngOnInit() {
    this.currentTime = (new Date()).getTime();
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

  userProfilePictureNotFound(event) {
    event.target.src = this.fileUploader.downloadUrl + 'man.png';
  }

  onDelete(id: string) {
    this.usersService.deleteUser(id)
      .subscribe(() => this.usersService.fetchAll());
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }
}
