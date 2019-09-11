import {Component, Input, OnDestroy} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DateHelper} from '../../../../_helpers/date-helper';
import {DayMenuModel} from '../../../models/day-menu.model';
import {OverviewFormService} from '../overview-form.service';
import {NotifierService} from 'angular-notifier';
import {AuthenticationService} from '../../../../_services';

@Component({
  selector: 'app-overview-form-planning',
  templateUrl: './overview-form-planning.component.html',
  styleUrls: ['../../forms.component.less']
})
export class OverviewFormPlanningComponent implements OnDestroy {

  @Input()  protected startOfWeek: any;
  @Input()  endOfWeek: any;

  @Input()  dayMenus: DayMenuModel[] = [];

  subscriptions = [];

  constructor(
    protected authenticationService: AuthenticationService,
    protected activeModal: NgbActiveModal,
    protected overviewService: OverviewFormService,
    protected notifier: NotifierService
  ) {}

  getFormattedDate(date) {
    return DateHelper.getLongFormattedDate(date);
  }

  get getActualDateRange() {
    return `${DateHelper.getFormattedDate(this.startOfWeek)} al ${DateHelper.getFormattedDate(this.endOfWeek)}`;
  }

  protected onConfirmWeek() {
    this.overviewService.confirmWeek(this.startOfWeek, this.authenticationService.currentUserValue.userId).subscribe((response) => {
      console.log(response);
      this.notifier.notify(
        'success',
        `La semana ${this.getActualDateRange} ha sido confirmada.`
      );
      this.activeModal.close();
    });
  }

  protected get getConfirmMessage() {
    return `¿Confirmas la semana <i><b>${this.getActualDateRange}</b></i>?`;
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
