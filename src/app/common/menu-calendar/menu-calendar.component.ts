import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbDate, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DayMenuModel} from '../models/day-menu.model';
import {MenuCalendarService} from './menu-calendar.service';
import {Router} from '@angular/router';
import {Constants} from '../../_helpers/constants';
import {DateHelper} from '../../_helpers/date-helper';
import {OverviewFormPlanningComponent} from '../forms/overview-form/overview-form-view/overview-form-planning.component';

@Component({
  selector: 'app-planning-calendar',
  templateUrl: './menu-calendar.component.html',
  styleUrls: ['./menu-calendar.component.less']
})
export class MenuCalendarComponent implements OnInit, OnDestroy {

  @Input() currentUser: any;

  @Input() startOfWeek: any;
  @Input() endOfWeek: any;

  actualMonth: any;

  minDate: any;
  maxDate: any;

  dayMenus: any;
  dayMenusList: DayMenuModel[] = [];

  planningServiceSubscription: any;

  isNA        = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.NA.key) || this.isAction(date);
  isSent      = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.SENT.key);
  isApproved  = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.APPROVED.key);
  isPending   = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.PENDING.key);

  isAction    = (date: NgbDate) => DateHelper.getDayOfWeek(this.formatDate(date)) === 6;
  isActionEnabled(date: NgbDate): boolean {
    if (!this.isAction(date)) {
      return false;
    }

    const actualDate = this.formatDate(date);
    const actualStartDate = DateHelper.getStartOfType(actualDate, Constants.displayTypes.WEEK);
    const actualEndDate = DateHelper.getEndOfType(actualDate, Constants.displayTypes.WEEK);

    for (const d = actualStartDate; d.isBefore(actualEndDate); d.add(1, 'days')) {
      if (this.dayMenus === undefined || this.dayMenus === null) {
        return false;
      }
      const status = this.dayMenus[DateHelper.getSimpleFormattedDate(d)];
      if (status !== undefined && status !== null
        && (status === Constants.statusTypes.SENT.key || status === Constants.statusTypes.PENDING.key)) {
        return true;
      }
    }
    return false;
  }

  constructor(
    protected planningService: MenuCalendarService,
    protected modalService: NgbModal,
    protected router: Router
  ) { }

  ngOnInit() {
    this.minDate = JSON.parse(this.startOfWeek.format('{["year"]:YYYY, ["month"]:M, ["day"]:D}'));
    this.maxDate = JSON.parse(this.endOfWeek.format('{["year"]:YYYY, ["month"]:M, ["day"]:D}'));
  }

  /**
   * Method to get the default day menus.
   */
  protected getDayMenus() {
    this.planningServiceSubscription = this.planningService.userDayMenusDataChanged.subscribe((dayMenusResponse: DayMenuModel[]) => {
      this.dayMenus = this.menusToJson(dayMenusResponse);
      this.dayMenusList = dayMenusResponse;
    });

    this.planningService.getUserDayMenus(this.currentUser.userId, this.startOfWeek.toISOString(), this.endOfWeek.toISOString());
  }

  /**
   * Method to get only the updated week.
   * @param startOfWeek Start of week.
   * @param endOfWeek End of week.
   * TODO : update only week confirmed/published.
   */
  protected getDayMenusUpdate(startOfWeek, endOfWeek) {
    this.planningServiceSubscription = this.planningService.userUpdatedDayMenusDataChanged.subscribe((dayMenusResponse: DayMenuModel[]) => {

      for (const dayMenuResponse of dayMenusResponse) {
        // const oldDayMenuIndex = this.dayMenusList.findIndex(dMenu => dMenu.id === dayMenuResponse.id);
        // console.log(this.dayMenusList);
        // console.log(dayMenuResponse);
        // console.log(this.dayMenusList[oldDayMenuIndex]);
        // this.dayMenusList[oldDayMenuIndex] = dayMenuResponse;
        // console.log(this.dayMenusList[oldDayMenuIndex]);
      }

      console.log(dayMenusResponse);

      this.dayMenus = this.menusToJson(dayMenusResponse);

      // TODO : finish the update to actual month.
      this.actualMonth = {year: startOfWeek.year(), month: startOfWeek.month()};
    });

    this.planningService.getUpdatedUserMenu(this.currentUser.userId, startOfWeek.toISOString(), endOfWeek.toISOString());
  }

  /**
   * Action to do when next/previous month is selected
   * @param event Event to trigger.
   */
  public onNavigationChanged(event) {
    const date = event.next;
    this.actualMonth = `${date.year}/${date.month}/01`;

    this.startOfWeek = DateHelper.getStartOfType(this.actualMonth, Constants.displayTypes.MONTH).subtract(7, 'days');
    this.endOfWeek = DateHelper.getEndOfType(this.actualMonth, Constants.displayTypes.MONTH).add(7, 'days');

    this.getDayMenus();
  }

  /**
   * Action to do when next/previous day menu is selected.
   * @param event Event to trigger.
   */
  public onSelect(event) {
    if (!this.isAction(event)) {
      this.router.navigate([`/planning/${this.formatDate(event)}`]);
    }
  }

  /**
   * Method that will retrieve the weekday
   * @param startDatePublish Start of the week.
   */
  protected getWeekDay(startDatePublish) {
    const actualDate = this.formatDate(startDatePublish);
    const startDate = DateHelper.getStartOfType(actualDate, Constants.displayTypes.WEEK);
    const endDate = DateHelper.getEndOfType(actualDate, Constants.displayTypes.WEEK);

    const weekDayMenus = [];
    for (const dayMenu of this.dayMenusList) {
      const dayMenuDate = DateHelper.getDate(dayMenu.date);
      if (dayMenuDate.dayOfYear() >= startDate.dayOfYear() && dayMenuDate.dayOfYear() <= endDate.dayOfYear() - 2) {
        weekDayMenus.push(dayMenu);
      }
    }

    return weekDayMenus;
  }

  /**
   * Method that will confirm the week.
   * @param startDatePublish start date to publish
   */
  protected onConfirmWeek(startDatePublish) {
    const actualDate = this.formatDate(startDatePublish);
    const startDate = DateHelper.getStartOfType(actualDate, Constants.displayTypes.WEEK);
    const endDate = DateHelper.getEndOfType(actualDate, Constants.displayTypes.WEEK);
    const weekDayMenus = this.getWeekDay(startDatePublish);

    const publishModalRef = this.modalService.open(OverviewFormPlanningComponent, { size: 'lg' });
    publishModalRef.componentInstance.startOfWeek = startDate;
    publishModalRef.componentInstance.endOfWeek = endDate;
    publishModalRef.componentInstance.dayMenus = weekDayMenus;

    publishModalRef.result.then(() => {
      // this.getDayMenusUpdate(startDate, endDate);
      this.getDayMenus();
    }, () => {});
  }

  /**
   * Method that will format the date json.
   * @param date Date in json format.
   */
  protected formatDate(date) {
    return `${date.year}/${date.month}/${date.day}`;
  }

  /**
   * Method that will return the day of the status.
   * @param date Actual date.
   * @param expectedStatus The expected status to compare.
   */
  private isDateWithStatus(date, expectedStatus) {
    if (this.isAction(date)) {
      return false;
    }

    const formattedDate = this.formatDate(date);
    if (this.dayMenus === null || this.dayMenus === undefined) {
      return false;
    }

    const status = this.dayMenus[formattedDate];
    return status !== undefined && status === expectedStatus;
  }

  /**
   * Method that will map the status to a dictionary.
   * @param dayMenusResponse The response of the status.
   */
  protected menusToJson(dayMenusResponse) {
    const dayMenus = dayMenusResponse.sort((val1, val2) =>
      val1.date.dayOfYear() - val2.date.dayOfYear()
    );

    const menusJson = {};
    for (const dayMenu of dayMenus) {
      const date = DateHelper.getSimpleFormattedDate(dayMenu.date);
      menusJson[date] = this.setDayMenuStatus(dayMenu);
    }
    return menusJson;
  }

  /**
   * Method that will set the status of the daymenu.
   * @param dayMenu Actual day menu.
   */
  protected setDayMenuStatus(dayMenu) {
    let status = Constants.statusTypes.NA.key;
    if (dayMenu.userMenu !== null && dayMenu.userMenu !== undefined && dayMenu.dayMenu !== null && dayMenu.dayMenu !== undefined) {
      status = dayMenu.userMenu.status;
      if (status === undefined || status === null) {
        status = Constants.statusTypes.NA.key;
      }
    }
    return status;
  }

  ngOnDestroy(): void {
    this.planningServiceSubscription.unsubscribe();
  }

}
