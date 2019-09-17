import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestService } from '../_services/request.service';
import { DataHelperService } from '../_services/data.helper.service';
import { Department } from '../users/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  listChanged = new Subject<boolean>();

  constructor(
    private request: RequestService,
    private dataHelper: DataHelperService
  ) {}

  fetchAll() {
    return this.request.get('/Departments')
      .pipe(map((departments: Data[]) =>
        this.dataHelper.createModelArray(Department, departments)
      ));
  }

  create(costCenterDef: Data) {
    return this.request.post('/Departments', costCenterDef);
  }

  fetchById(id: string) {
    return this.request.get(`/Departments/${id}`);
  }

  update(id: string, updates: Data) {
    return this.request.patch(`/Departments/${id}`, updates);
  }

  delete(id: string) {
    return this.request.delete(`/Departments/${id}`);
  }
}