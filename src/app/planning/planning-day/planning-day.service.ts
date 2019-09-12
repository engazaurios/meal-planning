import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {RequestService} from '../../_services/request.service';
import {DateHelper} from '../../_helpers/date-helper';
import {DayMenuModel} from 'src/app/common/models/day-menu.model';
import {MenuModel} from 'src/app/common/models/menu.model';

@Injectable({ providedIn : 'root'})
export class PlanningDayService {

  loading = false;

  dayMenuDataChanged = new Subject<any>();

  constructor(
    protected requestService: RequestService
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

  /**
   * Method that will delete the menu.
   * @param dayMenu DayMenu to delete.
   * @param menu Menu to delete.
   */
  deleteMenu(dayMenu: DayMenuModel, menu: MenuModel) {
    return this.requestService.delete(`/daymenus/${dayMenu.id}/menus/rel/${menu.id}`);
  }

}
