import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserMenuModel} from 'src/app/common/models/user-menu.model';
import {DateHelper} from '../../_helpers/date-helper';
import {Constants} from '../../_helpers/constants';

@Component({
  selector: 'app-menu-list-header',
  templateUrl: './menu-list-header.component.html',
  styleUrls: ['./menu-list-header.component.less']
})
export class MenuListHeaderComponent implements OnInit {

  @Input() actualDate: any;
  @Input() userMenu: UserMenuModel;

  @Output() dayChangedEvent = new EventEmitter<string>();

  isPending = (status: string) => Constants.isStatusType(status, Constants.statusTypes.PENDING);
  isSent = (status: string) => Constants.isStatusType(status, Constants.statusTypes.SENT);
  isApproved = (status: string) => Constants.isStatusType(status, Constants.statusTypes.APPROVED);

  constructor() { }

  ngOnInit() {
  }

  /**
   * Method that returns a formatted previous date.
   */
  public getPreviousDate() {
    return DateHelper.getFormattedDate(DateHelper.getPreviousDay(this.actualDate));
  }

  /**
   * Method that returns a formatted next date.
   */
  public getNextDate() {
    return DateHelper.getFormattedDate(DateHelper.getNextDay(this.actualDate));
  }

  /**
   * Method that returns formatted date of day menu.
   */
  public getFormattedDate() {
    return DateHelper.getLongFormattedDate(this.actualDate);
  }

  /**
   * Method that goes to the next or previous day depending on action.
   * @param action Which action should it take, next/previous.
   */
  public clickOnArrow(action) {
    this.actualDate = action === 'next' ?
      DateHelper.getNextDateType(this.actualDate, Constants.displayTypes.DAY)
      : DateHelper.getPreviousDateType(this.actualDate, Constants.displayTypes.DAY);
    this.dayChangedEvent.emit(this.actualDate);
  }

}
