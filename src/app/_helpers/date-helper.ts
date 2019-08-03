import * as moment from 'moment';
import {Constants} from './constants';

export class DateHelper {

  static getDate(actualDate?, format = 'YYYY/MM/DD') {
    return undefined === actualDate ? moment() : moment(actualDate, format);
  }

  // Method to return the week day number.

  static getDayOfWeek(actualDate?) {
    return this.getDate(actualDate).weekday();
  }

  // Methods to return format of actualDate.

  static getFormattedDate(actualDate) {
    return actualDate.format('YYYY/M/DD');
  }

  static getLongFormattedDate(actualDate) {
    return this.getDate(actualDate).format('dddd DD MMMM, YYYY');
  }

  static getFormattedDateFromString(actualDate) {
    return this.getFormattedDate(this.getDate(actualDate));
  }

  // Methods to return the start of DAY, WEEK, MONTH, YEAR, if applicable.

  static getStartOfType(actualDate, startType) {
    return this.getDate(actualDate).startOf(startType.key);
  }

  static getEndOfType(actualDate, endType) {
    return this.getDate(actualDate).endOf(endType.key);
  }

  static getStartOfWeek(actualDate) {
    return this.getStartOfType(actualDate, Constants.displayTypes.WEEK.key);
  }

  static getEndOfWeek(actualDate) {
    return this.getEndOfType(actualDate, Constants.displayTypes.WEEK.key);
  }

  // Methods to get the next DAY, WEEK, MONTH, YEAR, if applicable.

  static getNextDateType(actualDate, type, amount = 1) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.add(amount, type.key);
  }

  static getPreviousDateType(actualDate, type, amount = 1) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.subtract(amount, type.key);
  }





  static getNextDate(actualDate, amountDays = 1) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.add(amountDays, 'days');
  }

  static getPreviousDate(actualDate, amountDays = 1) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.subtract(amountDays, 'days');
  }

  static getNextWeek(actualDate?) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.add(7, 'days');
  }

  static getPreviousWeek(actualDate?) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.subtract(7, 'days');
  }

  static getNextWeekEnd(actualDate?) {
    return this.getEndOfWeek(this.getNextWeek(actualDate));
  }

  static getPreviousWeekStart(actualDate?) {
    return this.getStartOfWeek(this.getPreviousWeek(actualDate));
  }

  static getNextMonth(amountMonths = 1, actualDate?) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.add(1, 'months');
  }

  static getPreviousMonth(amountMonths = 1, actualDate?) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.subtract(1, 'months');
  }

  static getNextMonthEnd(amountOfMonths?, actualDate?) {
    return this.getNextMonth(amountOfMonths, actualDate).endOf('week');
  }

  static getPreviousMonthStart(amountOfMonths?, actualDate?) {
    return this.getPreviousMonth(amountOfMonths, actualDate).startOf('week');
  }

}




