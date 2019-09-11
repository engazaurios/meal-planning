import { Injectable } from '@angular/core';
import { RequestService } from '../_services/request.service';
import { Data } from '@angular/router';
import { DataHelperService } from '../_services/data.helper.service';
import { map } from 'rxjs/operators';
import { CostCenter } from './cost-center.model';

@Injectable({
  providedIn: 'root'
})
export class CostCentersService {
  constructor(private request: RequestService, private dataHelper: DataHelperService) {}

  fetchAll() {
    return this.request.get('/CostCenters')
      .pipe(map((costCenters: Data[]) =>
        this.dataHelper.createModelArray(CostCenter, costCenters)
      ));
  }
}