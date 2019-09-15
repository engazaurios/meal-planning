import { Injectable } from '@angular/core';
import { RequestService } from '../_services/request.service';
import { Data } from '@angular/router';
import { DataHelperService } from '../_services/data.helper.service';
import { map } from 'rxjs/operators';
import { CostCenter } from './cost-center.model';
import { Subject } from 'rxjs';

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