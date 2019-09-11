import {Injectable} from '@angular/core';
import {RequestService} from '../../../_services/request.service';

@Injectable({providedIn: 'root'})
export class OverviewFormService {

  loading = false;

  constructor(
    private requestService: RequestService
  ) {
  }

  /**
   * Method that will publish the actual week.
   * @param startDateValue The start of the week.
   */
  publishWeek(startDateValue) {
    this.loading = true;
    return this.requestService.post('/daymenus/publishdaymenus/', {
      startDate: startDateValue
    });
  }

  /**
   * Method that will confirm the actual week.
   * @param startDateValue The start of the week.
   * @param userID User ID to confirm.
   */
  confirmWeek(startDateValue, userID) {
    this.loading = true;
    return this.requestService.post('/usermenus/approve', {
      startDate: startDateValue,
      userId: userID
    });
  }

}
