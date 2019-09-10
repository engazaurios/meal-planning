import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

import { RequestService } from '../../_services/request.service';

@Injectable()
export class AttendanceService {

  constructor(private request: RequestService) {}

  attendance(data: Data) {
    return this.request.post('/Orders/Attendance', data);
  }

  getCurrentMeal() {
    return this.request.get('/Orders/CurrentMeal');
  }
}