import {Component, Input, OnInit} from '@angular/core';
import {UserMenu} from 'src/app/_models/UserMenu';
import {DateHelper} from '../../_models/DateHelper';

@Component({
  selector: 'app-menu-list-header',
  templateUrl: './menu-list-header.component.html',
  styleUrls: ['./menu-list-header.component.less']
})
export class MenuListHeaderComponent implements OnInit {

  @Input() actualDate: any;
  @Input() userMenu: UserMenu;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Method that returns a formatted previous date.
   */
  private getPreviousDate() {
    return DateHelper.getFormattedDate(DateHelper.getPreviousDate(this.actualDate));
  }

  /**
   * Method that returns a formatted next date.
   */
  private getNextDate() {
    return DateHelper.getFormattedDate(DateHelper.getNextDate(this.actualDate));
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
    const arrowDate = action === 'next' ? DateHelper.getNextDate(this.actualDate) : DateHelper.getPreviousDate(this.actualDate);
    const arrowDateDay = arrowDate.dayOfYear();
    const previousWeekDay = DateHelper.getPreviousMonthStart().dayOfYear();
    const nextWeekDay = DateHelper.getNextMonthEnd().dayOfYear();

    if (nextWeekDay >= arrowDateDay && arrowDateDay >= previousWeekDay) {
      window.location.href = `planning/${DateHelper.getFormattedDate(arrowDate)}`;
    }

  }

}
