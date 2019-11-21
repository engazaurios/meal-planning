import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { NotifierService } from 'angular-notifier';

import { UsersService } from '../users/users.service';
import { ReportingServie } from './reporting.service';
import { CostCentersService } from '../cost-centers/cost-centers.service';
import { User } from '../common/models/user.model';
import { CostCenter } from '../common/models/cost-center.model';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.less']
})
export class ReportingComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  allUsers: User[];
  allCostCenters: CostCenter[];
  usersSubscription: Subscription;
  reportTypes = [
    {
      key: 'UNIFIED',
      name: 'Unificado',
    },
    {
      key: 'TABS',
      name: 'Separado',
    },
    {
      key: 'RAW_DATA',
      name: 'Plano'
    },
    {
      key: 'CSV',
      name: 'CSV'
    },
  ];

  constructor(
    private reporting: ReportingServie,
    private usersService: UsersService,
    private costCentersService: CostCentersService,
    private notifier: NotifierService
  ) {
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
      costCenters: new FormControl([]),
      users: new FormControl([]),
      reportType: new FormControl('UNIFIED', Validators.required),
    });
  }

  ngOnInit() {
    this.allUsers = [];
    this.allCostCenters = [];
    this.usersService.fetchAll();

    this.usersSubscription = this.usersService.listChanged
      .subscribe((users: User[]) => {
        this.allUsers = users;
      });

    this.costCentersService.fetchAll()
      .subscribe((costCenters: CostCenter[]) => {
        this.allCostCenters = costCenters;
      });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  onSubmit() {
    const values = this.filterForm.value;

    if (!values.fromNgbDate || !values.toNgbDate || !values.reportType) {
      this.notifier.notify('error', 'Parámetros incompletos.');

      return;
    }

    let filters = {
      users: values.users,
      costCenters: values.costCenters,
      reportType: values.reportType,
    };

    const fromNgbDate = <NgbDate>values.fromNgbDate;
    const toNgbDate = <NgbDate>values.toNgbDate;

    filters['from'] = new Date(fromNgbDate.year, fromNgbDate.month - 1, fromNgbDate.day).toISOString();
    filters['to'] = new Date(toNgbDate.year, toNgbDate.month - 1, toNgbDate.day).toISOString();

    this.reporting.downloadReport(filters)
      .subscribe((response: Blob) => {
        const isCSV = values.reportType === 'CSV';
        const contentType = isCSV ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const blob = new Blob([response], { type: contentType });

        saveAs(blob, 'Reporte-Comidas.' + (isCSV ? 'csv' : 'xlsx'));
      }, (error) => {
        this.notifier.notify('error', 'No se pudo generar el reporte. Recargue la página.');
      });
  }
}
