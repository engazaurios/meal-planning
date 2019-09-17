import {Component, Input, OnInit} from '@angular/core';
import {MenuModel} from '../../../models/menu.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['../../forms.component.less']
})
export class MenuViewComponent implements OnInit {

  @Input()  selectedMenu: MenuModel;

  constructor(protected activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public close(reason) {
    this.activeModal.close(reason);
  }

}
