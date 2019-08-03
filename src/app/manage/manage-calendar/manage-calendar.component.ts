import {MenuCalendarComponent} from '../../common/menu-calendar/menu-calendar.component';
import {Component, EventEmitter, Output} from '@angular/core';
import {MenuCalendarService} from '../../common/menu-calendar/menu-calendar.service';
import {Router} from '@angular/router';
import {Constants} from '../../_helpers/constants';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-planning-calendar-admin',
  templateUrl: '../../common/menu-calendar/menu-calendar.component.html',
  styleUrls: ['../../common/menu-calendar/menu-calendar.component.less']
})
export class ManageCalendarComponent extends MenuCalendarComponent {

  @Output() dayClickedEvent = new EventEmitter<any>();

  constructor(planningService: MenuCalendarService, router: Router) {
    super(planningService, router);
  }

  /**
   * Method that will set the status of the DayMenu.
   * @param dayMenu Actual day menu.
   */
  protected setDayMenuStatus(dayMenu): any {
    if (dayMenu.dayMenu !== null) {
      if (dayMenu.userMenu !== null) {
        return Constants.statusTypes.OPEN.key;
      } else {
        return Constants.statusTypes.PENDING.key;
      }
    } else {
      return Constants.statusTypes.APPROVED.key;
    }
  }

  /**
   * Action to do when next/previous day menu is selected.
   * @param event Event to trigger.
   */
  protected onSelect(event) {
    this.dayClickedEvent.emit({date: this.formatDate(event), status: this.isPending(
      new NgbDate(event.year, event.month, event.day)
    )});
    this.router.navigate([`/manage/${this.formatDate(event)}`]);
  }

}
