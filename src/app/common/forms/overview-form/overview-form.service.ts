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
    return this.requestService.post('/usermenus/publishdaymenus/', {
      startDate: startDateValue
    });
  }

  /**
   * Method that will confirm the actual week.
   * @param startDateValue The start of the week.
   * TODO : finish method.
   */
  confirmWeek(startDateValue) {
    this.loading = true;
    return this.requestService.post('', {
      startDate: startDateValue
    });
  }

}
