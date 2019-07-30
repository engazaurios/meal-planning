import { Data } from '@angular/router';
import { User } from '../users/user.model';
import { Department } from '../users/department.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

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

  createModelArray(model: Object, data: Object[]) {
    return data.map((modelData) => this.createModel(model, modelData));
  }

  createUserFromObject(data: Object): User {
    let user = new User();

    Object.keys(data).forEach(key => {
      if (!user.hasOwnProperty(key)) {
        return;
      }

      if (key === 'birthday') {
        let birthday = moment(data[key]);
        
        if (birthday.isValid()) {
          user['birthday'] = birthday.toDate();
          user['birthdayNgbDate'] = new NgbDate(
            birthday.year(),
            birthday.month() + 1,
            birthday.date()
          );
        }
      } else {
        user[key] = data[key];
      }
    });

    return user;
  }
}
