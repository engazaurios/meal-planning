import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import {I18n} from '../_helpers/I18n.service';
import {I18nDatePicker} from '../_helpers/i18n-date-picker.service';
import {DateHelper} from '../_models/DateHelper';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.less'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: I18nDatePicker}]
})
export class PlanningComponent implements OnInit, OnDestroy {

  currentUser: any;

  startOfWeek: any;
  endOfWeek: any;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.startOfWeek = DateHelper.getPreviousMonthStart();
    this.endOfWeek = DateHelper.getNextMonthEnd();

    console.log(this.startOfWeek);
    console.log(this.endOfWeek);
  }

  ngOnDestroy(): void {
  }

}
