import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

import { RequestService } from '../../_services/request.service';

@Injectable()
export class AttendanceService {

  constructor(private request: RequestService) {}

  attendance(data: Data) {
    return this.request.post('/Orders/TempAttendance', data);
  }

  getAttendance(date: String, hour: Number, minute: Number) {
    const config = {
      params: {
        date: date,
        hour: hour,
        minute: minute
      }
    };
    return this.request.get('/Orders/Attendance', config);
  }

  formatDate(date: Date) {
    var month = '' + (date.getMonth() +1);
    var day = '' + date.getDate();
    var year = date.getFullYear();
    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;
    return [year, month, day].join('-');
  }
}