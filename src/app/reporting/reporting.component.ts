import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.less']
})
export class ReportingComponent implements OnInit {
  filterForm: FormGroup;

  constructor() {
    const startMonth = moment().startOf('month');
    const endMonth = moment().endOf('month');

    this.filterForm = new FormGroup({
      fromNgbDate: new FormControl(new NgbDate(
        startMonth.year(),
        startMonth.month() + 1,
        startMonth.date()
      )),
      toNgbDate: new FormControl(new NgbDate(
        endMonth.year(),
        endMonth.month() + 1,
        endMonth.date()
      ))
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.filterForm.value);
  }
}
