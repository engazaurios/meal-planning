import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {DateHelper} from '../_helpers/date-helper';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.less']
})
export class ManageComponent implements OnInit {

  currentUser: any;

  startOfWeek: any;
  endOfWeek: any;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    // Subtracts one more month to publish menus.
    this.startOfWeek = DateHelper.getPreviousMonthStart().subtract(1, 'months');
    // Adds one more month to publish menus.
    this.endOfWeek = DateHelper.getNextMonthEnd().add(1, 'months');

    console.log(this.startOfWeek);
    console.log(this.endOfWeek);
  }

  onDayClicked(event) {
    console.log(event);
  }

}
