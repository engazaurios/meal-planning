import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Data } from '@angular/router';
import { map } from 'rxjs/operators';

import { RequestService } from '../_services/request.service';
import { DataHelperService } from '../_services/data.helper.service';
import { User } from '../common/models/user.model';
import { Role } from '../common/models/role.model';

@Injectable()
export class UsersService {
  list: User[] = [];
  listChanged = new Subject<User[]>();

  constructor(
    private request: RequestService,
    private dataHelper: DataHelperService
  ) {}

  fetchAll() {
    return this.request.get('/AppUsers')
      .subscribe((users: Data[]) => {
        this.list = users.map(userData => new User(userData));
        this.listChanged.next(this.list);
      });
  }

  peekById(id: string) {
    return this.list.find(u => u.id === id);
  }

  fetchById(id: string) {
    return this.request.get(`/AppUsers/${id}`);
  }

  createUser(userData: Data) {
    return this.request.post('/AppUsers', userData);
  }

  updateUser(id: string, updates: Data) {
    return this.request.patch(`/AppUsers/${id}`, updates);
  }

  deleteUser(id: string) {
    return this.request.delete(`/AppUsers/${id}`);
  }

  fetchRoles() {
    return this.request.get('/Roles')
      .pipe(map((roleData: Data[]) =>
        this.dataHelper.createModelArray(Role, roleData)
      ));
  }
}
