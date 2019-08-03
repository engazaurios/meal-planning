import {CategoryModel} from './category.model';
import {MealModel} from './meal.model';
import {Type} from 'class-transformer';

export class MenuModel {

  id: string;
  title: string;
  description: string;
  price: number;

  @Type(() => MealModel)
  meal: MealModel;
  mealId: string;

  @Type(() => CategoryModel)
  category: CategoryModel;
  categoryId: string;

  constructor(title: string, description: string, price: number,
              mealId: string, categoryId: string) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.mealId = mealId;
    this.meal = new MealModel(this.mealId);
    this.categoryId = categoryId;
    this.category = new CategoryModel(this.categoryId);
  }

  getElementByID(idPath: string): string {
    let actualObject = this.toJson();
    for (const id of idPath.split('.')) {
      actualObject = actualObject[`${id}`];
    }
    return actualObject.toString();
  }

  getMealCode() {
    return this.meal.code;
  }

  toJson() {
    return {
      title: this.title,
      description: this.description,
      price: this.price,
      mealId: this.mealId,
      categoryId: this.categoryId,
      meal: this.meal.toJson(),
      category: this.category.toJson()
    };
  }

}
