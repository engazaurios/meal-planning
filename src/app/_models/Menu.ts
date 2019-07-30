import {Category} from './Category';
import {Meal} from './Meal';
import {Type} from 'class-transformer';

export class Menu {

  id: string;
  title: string;
  description: string;
  price: number;

  @Type(() => Meal)
  meal: Meal;
  mealId: string;

  @Type(() => Category)
  category: Category;
  categoryId: string;

  getMealCode() {
    return this.meal.code;
  }

}
