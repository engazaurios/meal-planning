import * as moment from 'moment';

export class DateHelper {

  constructor() {
  }

  static getDate(actualDate, format = 'YYYY/MM/DD') {
    return undefined === actualDate ? moment() : moment(actualDate, format);
  }

  static getFormattedDate(actualDate) {
    return actualDate.format('YYYY/M/DD');
  }

  static getLongFormattedDate(actualDate) {
    return this.getDate(actualDate).format('dddd DD MMMM, YYYY');
  }

  static getFormattedDateFromString(actualDate) {
    return this.getFormattedDate(this.getDate(actualDate));
  }

  static getSlashFormattedActualDate(actualDate) {
    return actualDate.format('YYYY-MM-DD');
  }

  static getNextDate(actualDate) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.add(1, 'days');
  }

  static getPreviousDate(actualDate) {
    const dateMoment = this.getDate(actualDate);
    return dateMoment.subtract(1, 'days');
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
    return this.getNextWeek(actualDate).endOf('week');
  }

  static getPreviousWeekStart(actualDate?) {
    return this.getPreviousWeek(actualDate).startOf('week');
  }

}




