import {Menu} from './Menu';
import {Type, Transform} from 'class-transformer';
import {Constants} from '../_helpers/constants';
import {DateHelper} from './DateHelper';

export class UserMenu {

  id: string;
  userId: string;
  status: string;

  @Type(() => Menu)
  menus: Menu[] = [];

  @Transform(value => DateHelper.getFormattedDateFromString(value), { toClassOnly: true })
  date: any;

  constructor() {
    this.status = 'NA';
  }

  getStatus() {
    return this.status.toLowerCase();
  }

  getStatusTitle() {
    return Constants.statusKey[this.status];
  }

  alreadySent() {
    return this.status === 'SENT';
  }

}
