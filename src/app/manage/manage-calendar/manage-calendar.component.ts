import {MenuCalendarComponent} from '../../common/menu-calendar/menu-calendar.component';
import {Component, OnInit} from '@angular/core';
import {MenuCalendarService} from '../../common/menu-calendar/menu-calendar.service';
import {Router} from '@angular/router';
import {Constants} from '../../_helpers/constants';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DateHelper} from '../../_helpers/date-helper';
import {OverviewFormManageComponent} from '../../common/forms/overview-form/overview-form-manage/overview-form-manage.component';
import {DayMenuModel} from '../../common/models/day-menu.model';

@Component({
  selector: 'app-planning-calendar-admin',
  templateUrl: '../../common/menu-calendar/menu-calendar.component.html',
  styleUrls: ['../../common/menu-calendar/menu-calendar.component.less']
})
export class ManageCalendarComponent extends MenuCalendarComponent implements OnInit {

  constructor(planningService: MenuCalendarService, modalService: NgbModal,  router: Router) {
    super(planningService, modalService, router);
  }

  /**
   * Method to get the default day menus.
   */
  protected getDayMenus() {
    this.planningServiceSubscription = this.planningService.dayMenuDataChanged.subscribe((dayMenusResponse: DayMenuModel[]) => {
      this.dayMenus = this.menusToJson(dayMenusResponse);
      this.dayMenusList = dayMenusResponse;
    });

    this.planningService.getDayMenus(this.startOfWeek.toISOString(), this.endOfWeek.toISOString());
  }

  /**
   * Method that will set the status of the DayMenu.
   * @param dayMenu Actual day menu.
   */
  protected setDayMenuStatus(dayMenu): any {
    return dayMenu.status;
  }

  /**
   * Action to do when next/previous day menu is selected.
   * @param event Event to trigger.
   */
  protected onSelect(event) {
    if (!this.isAction(event)) {
      this.router.navigate([`/manage/${this.formatDate(event)}`]);
    }
  }

  /**
   * Method to publish week.
   * @param startDatePublish Start day of week to publish.
   */
  protected onConfirmWeek(startDatePublish) {
    const actualDate = this.formatDate(startDatePublish);
    const startDate = DateHelper.getStartOfType(actualDate, Constants.displayTypes.WEEK);
    const endDate = DateHelper.getEndOfType(actualDate, Constants.displayTypes.WEEK);
    const weekDayMenus = this.getWeekDay(startDatePublish);

    const publishModalRef = this.modalService.open(OverviewFormManageComponent, {size: 'lg'});
    publishModalRef.componentInstance.startOfWeek = startDate;
    publishModalRef.componentInstance.endOfWeek = endDate;
    publishModalRef.componentInstance.dayMenus = weekDayMenus;
  }

}
