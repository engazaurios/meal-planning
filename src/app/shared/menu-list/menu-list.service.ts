import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Meal} from '../../_models/Meal';
import {RequestService} from '../../_services/request.service';

@Injectable({ providedIn : 'root'})
export class MenuListService {

  loading = false;

  mealDataChanged = new Subject<Meal[]>();

  constructor(
    private requestService: RequestService
  ) {}

  /**
   * Method that gets all the meals ID and Names.
   */
  getMeals() {
    this.loading = true;

    this.requestService.get('/meals').subscribe((meals: Meal[]) => {
      this.loading = false;
      this.mealDataChanged.next(meals);
    });
  }

}
