import { RequestService } from '../_services/request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UsersService {
  constructor(private request: RequestService) {}

  getAll() {
    return this.request.get('/AppUsers');
  }

  createUser(userData: JSON) {
    return this.request.post('/AppUsers', userData);
  }
}