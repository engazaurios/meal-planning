import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { CostCentersService } from '../cost-centers.service';
import { CostCenter } from '../../common/models/cost-center.model';

@Component({
  selector: 'app-edit-cost-center',
  templateUrl: './edit-cost-center.component.html',
  styleUrls: ['./edit-cost-center.component.less']
})
export class EditCostCenterComponent implements OnInit {
  costCenterForm: FormGroup;
  idEdit: string | null;
  @ViewChild('modalElm', { static: true }) modal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private notifier: NotifierService,
    private costCentersService: CostCentersService
  ) { }

  ngOnInit() {}

  initForm() {
    this.costCenterForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      discountPercent: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    });
  }

  openModal(costCenter: CostCenter | null) {
    this.idEdit = null;
    this.initForm();

    if (costCenter) {
      this.costCenterForm.setValue({
        code: costCenter.code,
        name: costCenter.name,
        discountPercent: costCenter.discountPercent
      });

      this.idEdit = costCenter.id;
    }

    this.modalService.open(this.modal);
  }

  onSubmit() {
    if (!this.costCenterForm.valid) {
      this.notifier.notify('error', 'Datos incompletos.');

      return;
    }

    const value = this.costCenterForm.value;

    const request = this.idEdit
      ? this.costCentersService.update(this.idEdit, value)
      : this.costCentersService.create(value);

    request.subscribe(
      () => {
        this.modalService.dismissAll();
        this.costCentersService.listChanged.next(true);
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
