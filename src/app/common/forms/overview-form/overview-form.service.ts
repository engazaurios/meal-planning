import {Injectable} from '@angular/core';
import {RequestService} from '../../../_services/request.service';
import {DateHelper} from 'src/app/_helpers/date-helper';

@Injectable({providedIn: 'root'})
export class OverviewFormService {

  constructor(
    private requestService: RequestService
  ) {
  }

  /**
   * Method that will publish the actual week.
   * @param startDateValue The start of the week.
   */
  publishWeek(startDateValue) {
    return this.requestService.post('/daymenus/publishdaymenus/', {
      startDate: DateHelper.getSlashFormattedDate(startDateValue)
    });
  }

  /**
   * Method that will confirm the actual week.
   * @param startDateValue The start of the week.
   * @param userID User ID to confirm.
   */
  confirmWeek(startDateValue, userID) {
    return this.requestService.post('/usermenus/approve', {
      startDate: DateHelper.getSlashFormattedDate(startDateValue),
      userId: userID
    });
  }

}
