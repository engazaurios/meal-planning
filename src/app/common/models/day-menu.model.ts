import { MenuModel } from './menu.model';
import { Transform, Type } from 'class-transformer';
import { DateHelper } from '../../_helpers/date-helper';

export class DayMenuModel {

  id: string;
  status: string;

  @Type(() => MenuModel)
  menus: MenuModel[] = [];

  @Transform(value => DateHelper.getDate(value), { toClassOnly: true })
  date: any;

  constructor(status: string, date: any) {
    this.status = status;
    this.date = DateHelper.getDate(date);
  }

  getMealsByMealCode(mealCode) {
    const meals = [];
    for (const menu of this.menus) {
      if (menu.getMealCode() === mealCode) {
        meals.push(menu);
      }
    }
    return meals;
  }

}
