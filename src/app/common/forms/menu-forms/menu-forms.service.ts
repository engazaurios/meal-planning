import { MenuModel } from '../../models/menu.model';
import { Injectable } from '@angular/core';
import { MenuListService } from '../../menu-list/menu-list.service';
import { Subject } from 'rxjs/internal/Subject';
import { RequestService } from '../../../_services/request.service';
import { DayMenuModel } from '../../models/day-menu.model';
import { Constants } from 'src/app/_helpers/constants';
import { DateHelper } from 'src/app/_helpers/date-helper';

@Injectable({providedIn: 'root'})
export class MenuFormsService extends MenuListService {

  menusDataChanged = new Subject<MenuModel[]>();
  dayMenuDataChanged = new Subject<DayMenuModel>();

  constructor(
    protected requestService: RequestService
  ) {
    super(requestService);
  }

  /**
   * Method that gets all the menu objects.
   */
  getAllMenus() {
    this.requestService.get('/menus').subscribe((menus: MenuModel[]) => {
      this.menusDataChanged.next(menus);
    });
  }

  /**
   * Method that will create the day menu.
   * @param actualDate Actual date to create.
   */
  createDayMenu(actualDate) {
    return this.requestService.post(
      '/daymenus', {date: DateHelper.getSlashFormattedDate(actualDate), status: Constants.statusTypes.PENDING.key}
    )
      .subscribe((newDayMenu: DayMenuModel) => {
        this.dayMenuDataChanged.next(newDayMenu);
      });
  }

  /**
   * Method that will delete the actual day menu.
   * @param dayMenu Day menu to delete.
   */
  deleteDayMenu(dayMenu: DayMenuModel) {
    this.requestService.delete(`/daymenus/${dayMenu.id}`, {}).subscribe((response) => {});
  }

  /**
   * Method that creates a menu.
   * @param menu Menu to create.
   */
  createMenu(menu: MenuModel) {
    return this.requestService.post('/menus', menu.toJson());
  }

  /**
   * Method that uploads a new Menu to that actual DayMenu.
   * @param dayMenu Actual day menu.
   * @param menu Menu to add.
   */
  uploadMenu(dayMenu: DayMenuModel, menu: MenuModel) {
    return this.requestService.put(`/daymenus/${dayMenu.id}/menus/rel/${menu.id}`);
  }

}
