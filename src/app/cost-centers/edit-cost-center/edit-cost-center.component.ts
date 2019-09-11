import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CostCentersService } from '../cost-centers.service';
import { CostCenter } from '../cost-center.model';

@Component({
  selector: 'app-edit-cost-center',
  templateUrl: './edit-cost-center.component.html',
  styleUrls: ['./edit-cost-center.component.less']
})
export class EditCostCenterComponent implements OnInit {
  costCenterForm: FormGroup;
  idEdit: string | null;
  @ViewChild('content', { static: true }) modal: ElementRef;

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
    });
  }

  openModal(costCenter: CostCenter | null) {
    this.idEdit = null;
    this.initForm();

    if (costCenter) {
      this.costCenterForm.controls['code'].setValue(costCenter.code);
      this.costCenterForm.controls['name'].setValue(costCenter.name);

      this.idEdit = costCenter.id;
    }

    this.modalService.open(this.modal);
  }

  onSubmit() {
    const value = this.costCenterForm.value;

    if (!value.code || !value.name) {
      this.notifier.notify('error', 'Datos incompletos.');

      return;
    }

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
