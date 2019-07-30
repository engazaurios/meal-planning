import {Injectable} from '@angular/core';
import {RequestService} from '../../_services/request.service';
import {Subject} from 'rxjs';
import {DayMenu} from '../../_models/DayMenu';
import {plainToClass} from 'class-transformer';

@Injectable({ providedIn : 'root'})
export class PlanningCalendarService {

  loading = false;

  dayMenusDataChanged = new Subject<any>();

  constructor(
    private requestService: RequestService
  ) {}

  /**
   * Method that returns all the day dayMenus from startDate to endDate
   * @param userId User id to retrieve data.
   * @param startDate Start date of the day dayMenus to display.
   * @param endDate End date of the day dayMenus to display.
   */
  getDayMenus(userId, startDate, endDate) {
    this.loading = true;

    this.requestService.get(`/usermenus/menusperdate/${userId}/${startDate}/${endDate}`).subscribe((data: any) => {
      this.loading = false;
      this.dayMenusDataChanged.next(plainToClass(DayMenu, data[`menus`]));
    });
  }

}
