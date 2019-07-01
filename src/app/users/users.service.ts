import { RequestService } from '../_services/request.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Data } from '@angular/router';

@Injectable()
export class UsersService {
  list: Data[] = [];
  listChanged = new Subject<Data[]>();

  constructor(private request: RequestService) {}

  getAll() {
    return this.request.get('/AppUsers')
      .subscribe((data: Data[]) => {
        this.list = data;
        this.listChanged.next(this.list);
      });
  }

  createUser(userData: Data) {
    return this.request.post('/AppUsers', userData);
  }

  deleteUser(id: string) {
    return this.request.delete(`/AppUsers/${id}`);
  }
}