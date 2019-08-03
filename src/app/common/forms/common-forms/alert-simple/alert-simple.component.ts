import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-simple',
  templateUrl: './alert-simple.component.html',
  styleUrls: ['../../forms.component.less']
})
export class AlertSimpleComponent {

  @Input() content: any = {
    title: '',
    description: '',
    cancelText: '',
    confirmationText: ''
  };

  constructor(
    protected activeModal: NgbActiveModal
  ) { }

}
