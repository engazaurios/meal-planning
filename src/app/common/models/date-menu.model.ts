import {Transform, Type} from 'class-transformer';
import {DateHelper} from '../../_helpers/date-helper';
import {UserMenuModel} from './user-menu.model';
import {DayMenuModel} from './day-menu.model';

// TODO : CHANGE NAME
export class DateMenuModel {

  @Type(() => DayMenuModel)
  dayMenu: DayMenuModel;

  @Type(() => UserMenuModel)
  userMenu: UserMenuModel;

  @Transform(value => DateHelper.getDate(value), { toClassOnly: true })
  date: any;

}
