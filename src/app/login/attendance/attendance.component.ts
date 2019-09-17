import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from './attendance.service';
import { HostListener } from '@angular/core';
import { finalize } from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  attendanceForm: FormGroup;
  statusClass: String;
  statusMessage: String;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected attendanceService: AttendanceService,
    protected formBuilder: FormBuilder
  ) {
    this.meal = "almuerzo";
    this.cont = "0";
    this.loading = false;
    this.selectedMeal = {};
    this.attendance = {};
    this.statusClass = '';
    this.statusMessage = '';
  }

  get form() {
    return this.attendanceForm.controls;
  }

  ngOnInit() {
    const todayDate = new Date();
    this.attendanceForm = this.formBuilder.group({
      qrCode: ['', Validators.required],
      date: [this.attendanceService.formatDate(todayDate), Validators.required],
      hour: [todayDate.getHours(), Validators.required],
      minute: [todayDate.getMinutes(), Validators.required]
    });

    this.attendanceService.getAttendance(this.form.date.value, this.form.hour.value, this.form.minute.value)
    .subscribe(data => {
      console.log('data: ', data);
      this.meal = (data['result'] && data['result']['selected'].name) || '----';
    }, error => {
      console.log(error);
    });

  }

  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) { 
  //   this.cont = 0;
  //   this.loading = true;
  //   this.attendanceService.attendance({token: "6UYDDbefg7BiGIqQ00aAAouu7uy1DnbzlZ5omFTlfemHblbbYGVLHGzCKsaqP3d6"})
  //   .pipe(finalize(()=>{
  //     this.loading = false;
  //   }))
  //   .subscribe((data) => {
  //     if (data['result'].attendance) {
  //       this.cont = data['result'].attendance;
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }

  onSubmit() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    if (this.attendanceForm.invalid) {
      this.showMessage('Codigo invalido', 'error');
      return;
    }
    this.statusMessage = 'Cargando...';

    this.attendanceService.attendance({
      qrCode: this.form.qrCode.value,
      date: this.form.date.value,
      hour: this.form.hour.value,
      minute: this.form.minute.value
    }).pipe(finalize(()=>{
      //this.loading = false;
    })).subscribe((data) => {
      if (data['result']) {
        const result = data['result'];
        const status = result['status'];
        if (status === 'SUCCESS') {
          
          this.attendanceService.getAttendance(this.form.date.value, this.form.hour.value, this.form.minute.value)
          .pipe(finalize(() => {
            this.statusClass = '';
            this.statusMessage = '';
            this.loading = false;
          })).subscribe((data) => {
            console.log(data);
            const result = data['result'];
            const attendance = result['attendance'];
            const selected = result['selected'];
            if (selected) {
              this.cont = attendance[selected.code];
            } else {
              this.cont = '---';
            }
          }, (error) => {
            console.log(error);
          });
        } else {
          this.form.qrCode.setValue('');
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
    }, 3000);
  }

}
