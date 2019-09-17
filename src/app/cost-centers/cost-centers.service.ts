import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestService } from '../_services/request.service';
import { DataHelperService } from '../_services/data.helper.service';
import { CostCenter } from '../common/models/cost-center.model';

@Injectable({
  providedIn: 'root'
})
export class CostCentersService {
  listChanged = new Subject<boolean>();

  constructor(
    private request: RequestService,
    private dataHelper: DataHelperService
  ) {}

  fetchAll() {
    return this.request.get('/CostCenters')
      .pipe(map((costCenters: Data[]) =>
        this.dataHelper.createModelArray(CostCenter, costCenters)
      ));
  }

  create(costCenterDef: Data) {
    return this.request.post('/CostCenters', costCenterDef);
  }

  fetchById(id: string) {
    return this.request.get(`/CostCenters/${id}`);
  }

  update(id: string, updates: Data) {
    return this.request.patch(`/CostCenters/${id}`, updates);
  }

  delete(id: string) {
    return this.request.delete(`/CostCenters/${id}`);
  }
}