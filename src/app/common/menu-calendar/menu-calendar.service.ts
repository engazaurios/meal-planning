import {Injectable} from '@angular/core';
import {RequestService} from '../../_services/request.service';
import {Subject} from 'rxjs';
import {DayMenuModel} from '../models/day-menu.model';
import {plainToClass} from 'class-transformer';

@Injectable({ providedIn : 'root'})
export class MenuCalendarService {

  loading = false;

  userDayMenusDataChanged = new Subject<any>();
  userUpdatedDayMenusDataChanged = new Subject<any>();
  dayMenuDataChanged = new Subject<any>();

  constructor(
    private requestService: RequestService
  ) {}

  /**
   * Method that returns all the day dayMenus from startDate to endDate
   * @param userId User id to retrieve data.
   * @param startDate Start date of the day dayMenus to display.
   * @param endDate End date of the day dayMenus to display.
   */
  getUserDayMenus(userId, startDate, endDate) {
    this.loading = true;

    this.requestService.get(`/usermenus/menusperdate/${userId}/${startDate}/${endDate}`).subscribe((data: any) => {
      this.loading = false;
      this.userDayMenusDataChanged.next(plainToClass(DayMenuModel, data.menus));
    });
  }

  /**
   * Method that returns all the day dayMenus from startDate to endDate
   * @param userId User id to retrieve data.
   * @param startDate Start date of the day dayMenus to display.
   * @param endDate End date of the day dayMenus to display.
   */
  getUpdatedUserMenu(userId, startDate, endDate) {
    this.requestService.get(`/usermenus/menusperdate/${userId}/${startDate}/${endDate}`).subscribe((data: any) => {
      this.userUpdatedDayMenusDataChanged.next(plainToClass(DayMenuModel, data.menus));
    });
  }

  /**
   * Method that gets all the meals ID and Names.
   */
  getDayMenus(startDate, endDate) {
    this.loading = true;

    this.requestService.get(`/daymenus/menusperdate/${startDate}/${endDate}`)
      .subscribe((dayMenus: any) => {
        this.loading = false;
        this.dayMenuDataChanged.next(plainToClass(DayMenuModel, dayMenus.menus));
      });
  }

}
