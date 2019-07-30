import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Data } from '@angular/router';
import { map } from 'rxjs/operators';

import { RequestService } from '../_services/request.service';
import { DataHelperService } from '../_services/data.helper.service';
import { Department } from './department.model';
import { Role } from './role.model';
import { User } from './user.model';

@Injectable()
export class UsersService {
  list: User[] = [];
  listChanged = new Subject<User[]>();

  constructor(private request: RequestService, private dataHelper: DataHelperService) {}

  fetchAll() {
    return this.request.get('/AppUsers')
      .subscribe((users: Data[]) => {
        this.list = this.dataHelper.createModelArray(User, users);
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

  fetchDepartments() {
    return this.request.get('/Departments')
      .pipe(map((departmentData: Data[]) =>
        this.dataHelper.createModelArray(Department, departmentData)
      ));
  }

  fetchRoles() {
    return this.request.get('/Roles')
      .pipe(map((roleData: Data[]) =>
        this.dataHelper.createModelArray(Role, roleData)
      ));
  }
}
