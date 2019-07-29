import { Data } from '@angular/router';
import { User } from '../users/user.model';

export class DataHelperService {
  createModel(model: any, data: Data) {
    let modelInstance = new model();

    Object.keys(data).forEach(key => {
      if (modelInstance.hasOwnProperty(key)) {
        modelInstance[key] = data[key];
      }
    });

    return modelInstance;
  }

  createModelArray(model: Object, data: Data[]) {
    return data.map((modelData) => this.createModel(model, modelData));
  }

  createUserFromObject(data: Object): User {
    let user = new User();

    Object.keys(data).forEach(key => {
      if (key === 'birthday') {
        data[key] = new Date(data[key]);
      }

      if (user.hasOwnProperty(key)) {
        user[key] = data[key];
      }
    });

    return user;
  }
}