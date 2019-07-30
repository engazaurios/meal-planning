import {Menu} from './Menu';
import {Type, Transform} from 'class-transformer';
import {DateHelper} from './DateHelper';

export class DayMenu {

  id: string;
  status: string;

  @Type(() => Menu)
  menus: Menu[] = [];

  @Transform(value => DateHelper.getDate(value), { toClassOnly: true })
  date: any;

  getMealsByMealCode(mealCode) {
    const meals = [];
    for (const meal of this.menus) {
      if (meal.getMealCode() === mealCode) {
        meals.push(meal);
      }
    }
    return meals;
  }

}
