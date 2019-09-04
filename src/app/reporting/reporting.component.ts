import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { Department } from '../users/department.model';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.less']
})
export class ReportingComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  allUsers: User[];
  allDepartments: Department[];
  usersSubscription: Subscription;

  constructor(private usersService: UsersService) {
    const startMonth = moment().startOf('month');
    const endMonth = moment().endOf('month');

    this.filterForm = new FormGroup({
      fromNgbDate: new FormControl(new NgbDate(
        startMonth.year(),
        startMonth.month() + 1,
        startMonth.date()
      ), Validators.required),
      toNgbDate: new FormControl(new NgbDate(
        endMonth.year(),
        endMonth.month() + 1,
        endMonth.date()
      ), Validators.required),
      departments: new FormControl([]),
      users: new FormControl([]),
    });
  }

  ngOnInit() {
    this.allUsers = [];
    this.allDepartments = [];
    this.usersService.fetchAll();
    
    this.usersSubscription = this.usersService.listChanged
      .subscribe((users: User[]) => {
        this.allUsers = users;
      });
    
    this.usersService.fetchDepartments()
      .subscribe((departments: Department[]) => {
        this.allDepartments = departments;
      });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  onSubmit() {
    console.log(this.filterForm.value);
  }
}
