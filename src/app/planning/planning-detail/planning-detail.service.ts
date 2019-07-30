import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {DayMenu} from '../../_models/DayMenu';
import {RequestService} from '../../_services/request.service';
import {DateHelper} from '../../_models/DateHelper';

@Injectable({ providedIn : 'root'})
export class PlanningDetailService {

  loading = false;

  dayMenuDataChanged = new Subject<DayMenu>();

  constructor(
    private requestService: RequestService
  ) {}

  /**
   * Method that returns the day menu, based on the users Id and DateHelper.
   * @param userId User Id of actual user.
   * @param date DateHelper to retrieve.
   */
  getDayMenu(userId, date) {
    this.loading = true;

    date = DateHelper.getDate(date).toISOString();
    this.requestService.get(`/usermenus/menusperdate/${userId}/${date}/${date}`).subscribe((dayMenuJson: any) => {
      this.loading = false;
      this.dayMenuDataChanged.next(dayMenuJson.menus[0]);
    });
  }

  /**
   * Method that saves the dayMenus to the userId.
   * @param userIdValue User Id of user to save.
   * @param dateValue DateHelper of the user menu to add.
   * @param menusValue Meals to save.
   */
  postMenus(userIdValue, dateValue, menusValue) {
    this.loading = true;
    return this.requestService.post('/usermenus/savemenus', {
      userId: userIdValue,
      date: dateValue,
      menusId: menusValue
    });
  }

}
