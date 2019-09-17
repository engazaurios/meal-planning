import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DepartmentsService } from './departments.service';
import { Department } from '../common/models/department.model';
import { EditDepartmentComponent } from './edit-department/edit-department.component';

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

  @ViewChild('departmentModal', { static: false }) departmentModal: EditDepartmentComponent;

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
    this.departmentModal.openModal(null);
  }

  onEdit(id: string) {
    this.dataService.fetchById(id)
      .subscribe((department: Department) => {
        this.departmentModal.openModal(department);
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
