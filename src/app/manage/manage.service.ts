import { PlanningDayService } from '../planning/planning-day/planning-day.service';
import { RequestService } from 'src/app/_services/request.service';
import { Injectable } from '@angular/core';
import { DayMenuModel } from 'src/app/common/models/day-menu.model';

import { plainToClass } from 'class-transformer';
import { Subject } from 'rxjs';
import { DateHelper } from '../_helpers/date-helper';

@Injectable({providedIn: 'root'})
export class ManageService extends PlanningDayService {

  simpleDayMenuDataChanged = new Subject<any>();

  constructor(
    requestService: RequestService,
  ) {
    super(requestService);
  }

  /**
   * Method that gets all the meals ID and Names.
   */
  getDayMenus(startDate, endDate) {
    this.requestService.get(
      `/daymenus/menusperdate/${DateHelper.getSlashFormattedDate(startDate)}/${DateHelper.getSlashFormattedDate(endDate)}`
    )
      .subscribe((dayMenus: any) => {
        this.dayMenuDataChanged.next(plainToClass(DayMenuModel, dayMenus.menus));
      });
  }

  /**
   * Method that gets all the meals ID and Names.
   */
  getDayMenu(date, dateEnd?) {
    if (dateEnd === undefined) {
      dateEnd = date;
    }

    this.requestService.get(
      `/daymenus/menusperdate/${DateHelper.getSlashFormattedDate(date)}/${DateHelper.getSlashFormattedDate(dateEnd)}`
    )
      .subscribe((dayMenus: any) => {
        this.simpleDayMenuDataChanged.next(plainToClass(DayMenuModel, dayMenus.menus));
      });
  }

}
