import {PlanningDayService} from '../planning/planning-day/planning-day.service';
import {RequestService} from 'src/app/_services/request.service';
import {Injectable} from '@angular/core';
import {DayMenuModel} from 'src/app/common/models/day-menu.model';

import {plainToClass} from 'class-transformer';

// TODO : remove
@Injectable({ providedIn : 'root'})
export class ManageService extends PlanningDayService {

  constructor(
    requestService: RequestService,
  ) {
    super(requestService);
  }

  /**
   * Method that gets all the meals ID and Names.
   */
  getDayMenus(startDate, endDate) {
    this.loading = true;

    this.requestService.get(`/daymenus/daymenusperdate/${startDate}/${endDate}`)
      .subscribe((dayMenus: any) => {
        this.loading = false;
        this.dayMenuDataChanged.next(plainToClass(DayMenuModel, dayMenus.menus));
      });
  }

}
