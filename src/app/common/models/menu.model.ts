import {CategoryModel} from './category.model';
import {MealModel} from './meal.model';
import {Type} from 'class-transformer';

export class MenuModel {

  id: string;
  title: string;
  description: string;

  @Type(() => MealModel)
  meal: MealModel;
  mealId: string;

  @Type(() => CategoryModel)
  category: CategoryModel;
  categoryId: string;

  image: string;

  constructor(title: string, description: string,
              mealId: string, categoryId: string,
              image: string) {
    this.title = title;
    this.description = description;
    this.mealId = mealId;
    this.meal = new MealModel(this.mealId);
    this.categoryId = categoryId;
    this.category = new CategoryModel(this.categoryId);
    this.image = image;
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

  // TODO : check if we want to do the hardcode here.
  toJson() {
    return {
      title: this.title,
      description: this.description,
      price: '24.00',
      mealId: this.mealId,
      categoryId: this.categoryId,
      meal: this.meal.toJson(),
      category: this.category.toJson(),
      image: this.image
    };
  }

}
