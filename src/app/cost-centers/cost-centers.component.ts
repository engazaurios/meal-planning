import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CostCentersService } from './cost-centers.service';
import { CostCenter } from '../common/models/cost-center.model';
import { EditCostCenterComponent } from './edit-cost-center/edit-cost-center.component';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.less']
})
export class CostCentersComponent implements OnInit, OnDestroy {
  pageActions: Array<Object> = [
    {
      text: 'Agregar',
      buttonType: 'btn btn-action-dark',
      icon: 'fa fa-plus',
      callMethod: this.createCostCenter.bind(this),
    }
  ];

  @ViewChild('costCenterModal', { static: false }) costCenterModal: EditCostCenterComponent;

  costCenters: CostCenter[];

  listSubscription: Subscription;

  constructor(private dataService: CostCentersService) { }

  ngOnInit() {
    this.costCenters = [];
    this.fetchData();
    this.listSubscription = this.dataService.listChanged.subscribe(() => this.fetchData());
  }

  fetchData() {
    this.dataService.fetchAll()
      .subscribe((costCenters: CostCenter[]) => {
        this.costCenters = costCenters;
      });
  }

  createCostCenter() {
    this.costCenterModal.openModal(null);
  }

  onEdit(id: string) {
    this.dataService.fetchById(id)
      .subscribe((costCenter: CostCenter) => {
        this.costCenterModal.openModal(costCenter);
      });
  }

  onDelete(id: string) {
    this.dataService.delete(id)
      .subscribe(() => this.dataService.listChanged.next(true));
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }
}
