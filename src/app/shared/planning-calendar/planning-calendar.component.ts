import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {DayMenu} from '../../_models/DayMenu';
import {PlanningCalendarService} from './planning-calendar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-planning-calendar',
  templateUrl: './planning-calendar.component.html',
  styleUrls: ['./planning-calendar.component.less']
})
export class PlanningCalendarComponent implements OnInit, OnDestroy {

  @Input() currentUser: any;

  @Input() startOfWeek: any;
  @Input() endOfWeek: any;

  minDate: any;
  maxDate: any;

  dayMenus: any;

  planningServiceSubscription: any;

  // TODO : change based on role.
  isNA      = (date: NgbDate) => this.isDateWithStatus(date, 'not-available') && this.currentUser.role !== 'admin';
  isSent    = (date: NgbDate) => this.isDateWithStatus(date, 'sent');
  isPending = (date: NgbDate) => this.isDateWithStatus(date, 'pending');

  constructor(
    private planningService: PlanningCalendarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.minDate = JSON.parse(this.startOfWeek.format('{["year"]:YYYY, ["month"]:M, ["day"]:D}'));
    this.maxDate = JSON.parse(this.endOfWeek.format('{["year"]:YYYY, ["month"]:M, ["day"]:D}'));

    this.planningServiceSubscription = this.planningService.dayMenusDataChanged.subscribe((dayMenusResponse: DayMenu[]) => {
      this.dayMenus = this.menusToJson(dayMenusResponse);
    });

    this.planningService.getDayMenus(this.currentUser.userId, this.startOfWeek.toISOString(), this.endOfWeek.toISOString());
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
      let status = 'not-available';
      if (dayMenu.userMenu !== null && dayMenu.userMenu !== undefined && dayMenu.dayMenu !== null && dayMenu.dayMenu !== undefined) {
        status = dayMenu.userMenu.status.toLowerCase();
        if (status === undefined || status === null) {
          status = 'not-available';
        }
      }
      menusJson[date] = status;
    }
    return menusJson;
  }

  /**
   * Method that will return the day of the status.
   * @param date Actual date.
   * @param expectedStatus The expected status to compare.
   */
  private isDateWithStatus(date, expectedStatus) {
    const formattedDate = this.formatDate(date);
    if (this.dayMenus === null || this.dayMenus === undefined) {
      return;
    }

    const status = this.dayMenus[formattedDate];
    return status !== undefined && status === expectedStatus;
  }

  /**
   * Method that will format the date json.
   * @param date Date in json format.
   */
  private formatDate(date) {
    return `${date.year}/${date.month}/${date.day}`;
  }

  /**
   * Action to do when day menu is selected.
   * @param event Event to trigger.
   */
  private onSelect(event) {
    // TODO : change based on role.
    if (this.currentUser.role !== 'admin') {
      this.router.navigate([`/planning/${this.formatDate(event)}`]);
    } else {
      this.router.navigate([`/planning/${this.formatDate(event)}`]);
    }
  }

  ngOnDestroy(): void {
    this.planningServiceSubscription.unsubscribe();
  }

}
