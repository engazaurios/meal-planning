import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateHelper } from '../../../../_helpers/date-helper';
import { DayMenuModel } from '../../../models/day-menu.model';
import { OverviewFormService } from '../overview-form.service';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from '../../../../_services';
import { Constants } from '../../../../_helpers/constants';

@Component({
  selector: 'app-overview-form-planning',
  templateUrl: './overview-form-planning.component.html',
  styleUrls: ['../../forms.component.less']
})
export class OverviewFormPlanningComponent implements AfterViewChecked, OnDestroy {

  @ViewChild('modalTitle', {static: true}) modalTitle: ElementRef;

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

  ngAfterViewChecked() {
    // this.modalTitle.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  getFormattedDate(date) {
    return DateHelper.getLongFormattedDate(date);
  }

  isApproved(dayMenu: any) {
    return dayMenu.status === Constants.statusTypes.APPROVED.key;
  }

  get getActualDateRange() {
    return `${DateHelper.getFormattedDate(this.startOfWeek)} al ${DateHelper.getFormattedDate(this.endOfWeek)}`;
  }

  public onConfirmWeek() {
    this.overviewService.confirmWeek(this.startOfWeek, this.authenticationService.currentUserValue.userId).subscribe((response) => {
      this.notifier.notify(
        'success',
        `La semana ${this.getActualDateRange} ha sido confirmada.`
      );
      this.activeModal.close();
    });
  }

  public dismiss(value: boolean) {
    this.activeModal.dismiss(value);
  }

  public get getConfirmMessage() {
    return `¿Confirmas la semana <i><b>${this.getActualDateRange}</b></i>?`;
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
