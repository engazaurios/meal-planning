import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from './attendance.service';
import { HostListener } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.less']
})
export class AttendanceComponent implements OnInit {

  meal: String;
  key: String;
  cont: Number;
  loading: Boolean;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected attendanceService: AttendanceService
  ) {
    this.meal = "almuerzo";
    this.cont = 0;
    this.loading = false;
  }

  ngOnInit() {
    this.attendanceService.getCurrentMeal()
    .subscribe(data => {
      this.meal = data['result'].name;
    }, error => {
      console.log(error);
    });

  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.cont = 0;
    this.loading = true;
    this.attendanceService.attendance({token: "6UYDDbefg7BiGIqQ00aAAouu7uy1DnbzlZ5omFTlfemHblbbYGVLHGzCKsaqP3d6"})
    .pipe(finalize(()=>{
      this.loading = false;
    }))
    .subscribe((data) => {
      if (data['result'].attendance) {
        this.cont = data['result'].attendance;
      }
    }, (error) => {
      console.log(error);
    });
  }

  onSubmit() {

  }

}
