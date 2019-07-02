import { RequestService } from '../_services/request.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Data } from '@angular/router';
import { map } from 'rxjs/operators';
import { Department } from './department.model';
import { DataHelperService } from '../_services/data.helper.service';
import { Role } from './role.model';

@Injectable()
export class UsersService {
  list: Data[] = [];
  listChanged = new Subject<Data[]>();

  constructor(private request: RequestService, private dataHelper: DataHelperService) {}

  fetchAll() {
    return this.request.get('/AppUsers')
      .subscribe((data: Data[]) => {
        this.list = data;
        this.listChanged.next(this.list);
      });
  }

  peekById(id: string) {
    return this.list.find(u => u.id === id);
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