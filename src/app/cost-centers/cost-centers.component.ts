import { Component, OnInit } from '@angular/core';
import { CostCenter } from './cost-center.model';
import { CostCentersService } from './cost-centers.service';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.less']
})
export class CostCentersComponent implements OnInit {
  pageActions: Array<Object> = [
    {
      text: 'Agregar',
      buttonType: 'btn btn-success',
      icon: 'fa fa-plus',
      route: '/users/new',
    }
  ];

  costCenters: CostCenter[];

  constructor(private costCentersService: CostCentersService) { }

  ngOnInit() {
    this.costCenters = [];

    this.costCentersService.fetchAll()
      .subscribe((costCenters: CostCenter[]) => {
        this.costCenters = costCenters;
      });
  }

}
