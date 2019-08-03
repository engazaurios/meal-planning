import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {DayMenuModel} from '../models/day-menu.model';
import {MenuCalendarService} from './menu-calendar.service';
import {Router} from '@angular/router';
import {Constants} from '../../_helpers/constants';

@Component({
  selector: 'app-planning-calendar',
  templateUrl: './menu-calendar.component.html',
  styleUrls: ['./menu-calendar.component.less']
})
export class MenuCalendarComponent implements OnInit, OnDestroy {

  @Input() currentUser: any;

  @Input() startOfWeek: any;
  @Input() endOfWeek: any;

  minDate: any;
  maxDate: any;

  dayMenus: any;

  planningServiceSubscription: any;

  isNA        = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.NA.key);
  isPublished = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.OPEN.key);
  isSent      = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.SENT.key);
  isPending   = (date: NgbDate) => this.isDateWithStatus(date, Constants.statusTypes.PENDING.key);

  constructor(
    protected planningService: MenuCalendarService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.minDate = JSON.parse(this.startOfWeek.format('{["year"]:YYYY, ["month"]:M, ["day"]:D}'));
    this.maxDate = JSON.parse(this.endOfWeek.format('{["year"]:YYYY, ["month"]:M, ["day"]:D}'));

    this.planningServiceSubscription = this.planningService.dayMenusDataChanged.subscribe((dayMenusResponse: DayMenuModel[]) => {
      this.dayMenus = this.menusToJson(dayMenusResponse);
    });

    this.planningService.getDayMenus(this.currentUser.userId, this.startOfWeek.toISOString(), this.endOfWeek.toISOString());
  }

  /**
   * Action to do when next/previous day menu is selected.
   * @param event Event to trigger.
   */
  protected onSelect(event) {
    this.router.navigate([`/planning/${this.formatDate(event)}`]);
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
  private menusToJson(dayMenusResponse) {
    const dayMenus = dayMenusResponse.sort((val1, val2) =>
      val1.date.dayOfYear() - val2.date.dayOfYear()
    );

    const menusJson = {};
    for (const dayMenu of dayMenus) {
      const date = dayMenu.date.format('YYYY/M/D');
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
      status = dayMenu.userMenu.status.toLowerCase();
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
