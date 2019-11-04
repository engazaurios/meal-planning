import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from './attendance.service';

export enum KEY_CODE {
  ENTER = 13,
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.less']
})
export class AttendanceComponent implements OnInit {

  meal: String;
  key: String;
  cont: String;
  loading: Boolean;
  selectedMeal: Object;
  attendance: Object;
  statusClass: String;
  statusMessage: String;
  qrCode: String;
  date: String;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected attendanceService: AttendanceService,
  ) {
    this.meal = "";
    this.cont = "0";
    this.loading = false;
    this.selectedMeal = {};
    this.attendance = {};
    this.statusClass = '';
    this.statusMessage = '';
  }

  ngOnInit() {
    const todayDate = new Date();

    this.date = this.attendanceService.formatDate(todayDate);
    const hour = todayDate.getHours();
    const minute = todayDate.getMinutes();
    this.qrCode = '';

    this.attendanceService.getAttendance(this.date, hour, minute)
    .subscribe(data => {
      console.log('data: ', data);
      this.meal = (data['result'] && data['result']['selected'] && data['result']['selected'].name)
        || '----';
      this.cont = this.extractAttendance(data);
    }, error => {
      console.log(error);
    });

  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.postAttendance(this.qrCode);
      this.qrCode = '';
    } else {
      this.qrCode = this.qrCode +  event.key;
    }
  }

  postAttendance(token: String) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.statusMessage = 'Cargando...';

    const todayDate = new Date();
    this.date = this.attendanceService.formatDate(todayDate);
    const hour = todayDate.getHours();
    const minute = todayDate.getMinutes();

    this.attendanceService.attendance({
      token: token,
      date: this.date,
      hour: hour,
      minute: minute
    })
    .subscribe((data) => {
      if (data['result']) {
        const result = data['result'];
        const status = result['status'];
        if (status === 'SUCCESS') {
          this.attendanceService.getAttendance(this.date, hour, minute)
          .subscribe((data) => {
            this.cont = this.extractAttendance(data);
            this.statusClass = '';
            this.statusMessage = '';
            this.loading = false;
          }, (error) => {
            console.log(error);
            this.showMessage('Ocurrio un error', 'error');
          });
        } else {
          this.showMessage(result.message, status.toLowerCase());
        }
      }
    }, (error) => {
      this.showMessage('Ocurrio un error!', 'error');
      console.log(error);
    });
  }

  showMessage(statusMessage: String, statusClass: String) {
    this.statusMessage = statusMessage;
    this.statusClass = statusClass;
    setTimeout(() => {
      this.statusClass = '';
      this.statusMessage = '';
      this.loading = false;
    }, 2500);
  }

  extractAttendance(data: Object) {
    const result = data['result'];
    const attendance = result['attendance'];
    const selected = result['selected'];
    if (selected) {
      return attendance[selected.code];
    } else {
      return '---';
    }
  }

  goToLogin() {
    this.router.navigate(['/login'])
  }
}
