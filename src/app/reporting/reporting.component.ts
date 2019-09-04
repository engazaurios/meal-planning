import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { Department } from '../users/department.model';
import { ReportingServie } from './reporting.service';
import { saveAs } from 'file-saver';

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

  constructor(private reporting: ReportingServie, private usersService: UsersService) {
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
    const filters = this.filterForm.value;

    if (!filters.fromNgbDate || !filters.toNgbDate) {
      return;
    }

    const fromNgbDate = <NgbDate>filters.fromNgbDate;
    const toNgbDate = <NgbDate>filters.toNgbDate;

    filters.from = new Date(fromNgbDate.year, fromNgbDate.month - 1, fromNgbDate.day).toISOString();
    filters.to = new Date(toNgbDate.year, toNgbDate.month - 1, toNgbDate.day).toISOString();

    delete filters.fromNgbDate;
    delete filters.toNgbDate;

    this.reporting.downloadReport(filters)
      .subscribe((response: Blob) => {
        const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; 
        const blob = new Blob([response], { type: contentType });

        saveAs(blob, 'Reporte-Comidas.xlsx');
      });
  }
}
