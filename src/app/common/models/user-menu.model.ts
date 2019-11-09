import { MenuModel } from './menu.model';
import { Transform, Type } from 'class-transformer';
import { Constants } from '../../_helpers/constants';
import { DateHelper } from '../../_helpers/date-helper';

export class UserMenuModel {

  id: string;
  userId: string;
  status: string;

  @Type(() => MenuModel)
  menus: MenuModel[] = [];

  @Transform(value => DateHelper.getFormattedDateFromString(value), { toClassOnly: true })
  date: any;

  constructor(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  getStatusTitle() {
    return Constants.statusTypes[this.status.toUpperCase()].message;
  }

  alreadySent() {
    return this.status === 'SENT';
  }

}
