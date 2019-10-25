import { Data } from '@angular/router';
import { User } from '../common/models/user.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Role } from '../common/models/role.model';

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

  createModelArray(model: any, data: Object[]) {
    if ((new model()) instanceof User) {
      return data.map((modelData) => this.createUserFromObject(modelData));
    }

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
      }
      else if ((key === 'roles') && Array.isArray(data[key])) {
        user[key] = data[key].map(roleData => new Role(roleData.id, roleData.name));
      }
      else {
        user[key] = data[key];
      }
    });

    return user;
  }
}
