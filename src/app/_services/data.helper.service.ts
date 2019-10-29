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
    return data.map((modelData) => this.createModel(model, modelData));
  }
}
