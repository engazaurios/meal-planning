import {Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {I18n} from './I18n.service';

@Injectable()
export class I18nDatePicker extends NgbDatepickerI18n {

  I18N_VALUES = {
    es: {
      weekdays: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      monthsAll: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    },
    en: {
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthsAll: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ]
    }
  };

  constructor(
    private i18n: I18n
  ) {
    super();
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

  getMonthFullName(month: number, year?: number): string {
    return this.I18N_VALUES[this.i18n.language].monthsAll[month - 1];
  }

  getMonthShortName(month: number, year?: number): string {
    return this.I18N_VALUES[this.i18n.language].months[month - 1];
  }

  getWeekdayShortName(weekday: number): string {
    return this.I18N_VALUES[this.i18n.language].weekdays[weekday - 1];
  }

}
