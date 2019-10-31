import {Component, ViewChild, ElementRef} from '@angular/core';
import {OverviewFormPlanningComponent} from '../overview-form-view/overview-form-planning.component';

@Component({
  selector: 'app-overview-form-manage',
  templateUrl: './overview-form-manage.component.html',
  styleUrls: ['../../forms.component.less']
})
export class OverviewFormManageComponent extends OverviewFormPlanningComponent {

  public onConfirmWeek() {
    this.overviewService.publishWeek(this.startOfWeek).subscribe((response) => {
      this.notifier.notify(
        'success',
        `La semana ${this.getActualDateRange} ha sido publicada.`
      );
      this.activeModal.close();
    });
  }

  public get getConfirmMessage() {
    return `¿Publicas los siguientes días de la semana <i><b>${this.getActualDateRange}</b></i>?`;
  }

}
