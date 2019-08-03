export class MealModel {

  id: string;
  name: string;
  code: string;

  constructor(id: string) {
    this.id = id;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      code: this.code
    };
  }

}
