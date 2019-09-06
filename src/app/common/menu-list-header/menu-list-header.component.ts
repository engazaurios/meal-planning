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

  constructor() { }

  ngOnInit() {
  }

  /**
   * Method that returns a formatted previous date.
   */
  private getPreviousDate() {
    return DateHelper.getFormattedDate(DateHelper.getPreviousDay(this.actualDate));
  }

  /**
   * Method that returns a formatted next date.
   */
  private getNextDate() {
    return DateHelper.getFormattedDate(DateHelper.getNextDay(this.actualDate));
  }

  /**
   * Method that returns formatted date of day menu.
   */
  private getFormattedDate() {
    return DateHelper.getLongFormattedDate(this.actualDate);
  }

  /**
   * Method that goes to the next or previous day depending on action.
   * @param action Which action should it take, next/previous.
   */
  private clickOnArrow(action) {
    const arrowDate = action === 'next' ?
      DateHelper.getNextDateType(this.actualDate, Constants.displayTypes.DAY)
      : DateHelper.getPreviousDateType(this.actualDate, Constants.displayTypes.DAY);

    const arrowDateDay = arrowDate.dayOfYear();
    const previousWeekDay = DateHelper.getPreviousDateType(DateHelper.getDate(), Constants.displayTypes.MONTH).dayOfYear();
    const nextWeekDay = DateHelper.getNextDateType(DateHelper.getDate(), Constants.displayTypes.MONTH).dayOfYear();

    if (nextWeekDay >= arrowDateDay && arrowDateDay >= previousWeekDay) {
      this.actualDate = arrowDate;
      this.dayChangedEvent.emit(this.actualDate);
    }

  }

}
