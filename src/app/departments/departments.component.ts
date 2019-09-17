import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DepartmentsService } from './departments.service';
import { Department } from '../users/department.model';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.less']
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  pageActions: Array<Object> = [
    {
      text: 'Agregar',
      buttonType: 'btn btn-success',
      icon: 'fa fa-plus',
      callMethod: this.createDepartment.bind(this),
    }
  ];

  // @ViewChild('departmentModal', { static: false }) departmentModal: EditCostCenterComponent;

  departments: Department[];

  listSubscription: Subscription;

  constructor(private dataService: DepartmentsService) { }

  ngOnInit() {
    this.departments = [];
    this.fetchData();
    this.listSubscription = this.dataService.listChanged.subscribe(() => this.fetchData());
  }

  fetchData() {
    this.dataService.fetchAll()
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });
  }

  createDepartment() {
    // this.departmentModal.openModal(null);
  }

  onEdit(id: string) {
    this.dataService.fetchById(id)
      .subscribe((costCenter: Department) => {
        // this.departmentModal.openModal(costCenter);
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
