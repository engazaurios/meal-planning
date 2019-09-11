import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CostCentersService } from '../cost-centers.service';

@Component({
  selector: 'app-edit-cost-center',
  templateUrl: './edit-cost-center.component.html',
  styleUrls: ['./edit-cost-center.component.less']
})
export class EditCostCenterComponent implements OnInit {
  costCenterForm: FormGroup;
  @ViewChild('content', { static: true }) modal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private notifier: NotifierService,
    private costCentersService: CostCentersService
  ) { }

  ngOnInit() {
    this.costCenterForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
    });
  }

  openModal() {
    this.modalService.open(this.modal);
  }

  onSubmit() {
    const value = this.costCenterForm.value;

    if (!value.code || !value.name) {
      this.notifier.notify('error', 'Datos incompletos.');
    }

    this.costCentersService.create(value)
      .subscribe(
        () => {
          this.modalService.dismissAll();
          this.costCentersService.listChanged.next(true);
        },
        (error) => {
          this.notifier.notify('error', 'No se pudo crear el registro.');
        }
      );
  }
}
