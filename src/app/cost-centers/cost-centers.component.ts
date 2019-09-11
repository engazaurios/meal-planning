import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CostCenter } from './cost-center.model';
import { CostCentersService } from './cost-centers.service';
import { EditCostCenterComponent } from './edit-cost-center/edit-cost-center.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.less']
})
export class CostCentersComponent implements OnInit, OnDestroy {
  pageActions: Array<Object> = [
    {
      text: 'Agregar',
      buttonType: 'btn btn-success',
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
    this.costCenterModal.openModal();
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }
}
