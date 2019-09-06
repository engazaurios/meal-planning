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

  // Methods to get the previous/next date type.

  static getNextDateType(actualDate, type, amount = 1) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.add(amount, type.key);
  }

  static getPreviousDateType(actualDate, type, amount = 1) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.subtract(amount, type.key);
  }

  // Methods to get the previous/next DAY, WEEK, MONTH, YEAR, if applicable.

  static getNextDay(actualDate, amountDays = 1) {
    return this.getNextDateType(actualDate, Constants.displayTypes.DAY, amountDays);
  }

  static getPreviousDay(actualDate, amountDays = 1) {
    return this.getPreviousDateType(actualDate, Constants.displayTypes.DAY, amountDays);
  }

  static getNextMonth(amountMonths = 1, actualDate?) {
    return this.getNextDateType(actualDate, Constants.displayTypes.MONTH, amountMonths);
  }

  static getPreviousMonth(amountMonths = 1, actualDate?) {
    return this.getPreviousDateType(actualDate, Constants.displayTypes.MONTH, amountMonths);
  }

  static getNextMonthEnd(amountOfMonths?, actualDate?) {
    const date = this.getNextMonth(amountOfMonths, actualDate);
    return this.getEndOfType(date, Constants.displayTypes.WEEK);
  }

  static getPreviousMonthStart(amountOfMonths?, actualDate?) {
    const date = this.getPreviousMonth(amountOfMonths, actualDate);
    return this.getStartOfType(date, Constants.displayTypes.WEEK);
  }

}




