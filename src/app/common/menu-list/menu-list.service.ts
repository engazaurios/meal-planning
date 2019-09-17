import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MealModel} from '../models/meal.model';
import {RequestService} from '../../_services/request.service';
import {CategoryModel} from '../models/category.model';

@Injectable({ providedIn : 'root'})
export class MenuListService {

  mealDataChanged = new Subject<MealModel[]>();
  categoriesDataChanged = new Subject<CategoryModel[]>();

  constructor(
    protected requestService: RequestService
  ) {}

  /**
   * Method that gets all the meals ID and Names.
   */
  getMeals() {
    this.requestService.get('/meals').subscribe((meals: MealModel[]) => {
      this.mealDataChanged.next(meals);
    });
  }

  /**
   * Method that gets all the categories ID and Names.
   */
  getCategories() {
    this.requestService.get('/categories').subscribe((categories: CategoryModel[]) => {
      this.categoriesDataChanged.next(categories);
    });
  }

}
