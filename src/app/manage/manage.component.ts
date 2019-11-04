import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {DateHelper} from '../_helpers/date-helper';
import {I18n} from '../_helpers/I18n.service';
import {I18nDatePicker} from '../_helpers/i18n-date-picker.service';
import {NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.less'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: I18nDatePicker}]
})
export class ManageComponent implements OnInit {

  currentUser: any;

  startOfWeek: any;
  endOfWeek: any;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.startOfWeek = DateHelper.getPreviousMonthStart(2);
    this.endOfWeek = DateHelper.getNextMonthEnd(2);
  }

}
