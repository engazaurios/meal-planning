import { Data } from '@angular/router';

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
