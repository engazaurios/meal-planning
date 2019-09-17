import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DepartmentsService } from '../departments.service';
import { Department } from '../../common/models/department.model';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.less']
})
export class EditDepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  idEdit: string | null;
  @ViewChild('modalElm', { static: true }) modal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private notifier: NotifierService,
    private departmentsService: DepartmentsService
  ) { }

  ngOnInit() {
  }

  initForm() {
    this.departmentForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
    });
  }

  openModal(department: Department | null) {
    this.idEdit = null;
    this.initForm();

    if (department) {
      this.departmentForm.controls['code'].setValue(department.code);
      this.departmentForm.controls['name'].setValue(department.name);

      this.idEdit = department.id;
    }

    this.modalService.open(this.modal);
  }

  onSubmit() {
    if (!this.departmentForm.valid) {
      this.notifier.notify('error', 'Datos incompletos.');

      return;
    }

    const value = this.departmentForm.value;

    const request = this.idEdit
      ? this.departmentsService.update(this.idEdit, value)
      : this.departmentsService.create(value);

    request.subscribe(
      () => {
        this.modalService.dismissAll();
        this.departmentsService.listChanged.next(true);
      },
      () => {
        this.notifier.notify(
          'error',
          `No se pudo ${this.idEdit ? 'actualizar' : 'crear' } el registro.`
        );
      }
    );
  }
}
