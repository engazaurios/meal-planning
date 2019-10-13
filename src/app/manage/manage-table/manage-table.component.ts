import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateHelper} from '../../_helpers/date-helper';
import {DayMenuModel} from '../../common/models/day-menu.model';
import {MenuModel} from '../../common/models/menu.model';
import {Constants} from '../../_helpers/constants';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MenuCreateComponent} from '../../common/forms/menu-forms/menu-create/menu-create.component';
import {MenuUploadComponent} from '../../common/forms/menu-forms/menu-upload/menu-upload.component';
import {NotifierService} from 'angular-notifier';
import {ManageService} from '../manage.service';
import {AlertSimpleComponent} from '../../common/forms/common-forms/alert-simple/alert-simple.component';
import {MenuViewComponent} from '../../common/forms/menu-forms/menu-view/menu-view.component';
import {OverviewFormManageComponent} from '../../common/forms/overview-form/overview-form-manage/overview-form-manage.component';
import {Animations} from '../../_helpers/animations';

@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.less'],
  animations: [
    Animations.fadeIn,
    Animations.fadeInMove
  ]
})
export class ManageTableComponent implements OnInit, OnDestroy {

  actualDate: any;
  startDate: any;
  endDate: any;

  tableHeader = [
    {title: 'Menú', id: 'title'},
    {title: 'Tipo', id: 'meal.name'},
    {title: 'Categ.', id: 'category.name'},
  ];
  tableSortDesc = false;

  tableDisplayValues = Constants.displayTypes;
  tableDisplayType = this.tableDisplayValues.WEEK;

  dayMenus: DayMenuModel[] = [];

  subscriptions = [];

  isAvailable     = (status: string) => status === Constants.statusTypes.OPEN.key;
  isPending       = (status: string) => status === Constants.statusTypes.PENDING.key;
  isPublished     = (status: string) => status === Constants.statusTypes.APPROVED.key;
  statusText      = (status: string) => Constants.statusTypes[`${status.toUpperCase()}`].message;

  isActionDisabled = (dayMenu: DayMenuModel) => dayMenu && dayMenu.status === Constants.statusTypes.APPROVED.key;

  constructor(
    private modalService: NgbModal,
    private manageDayService: ManageService,
    private notifier: NotifierService
  ) { }

  /**
   * Method that will display the dates from actual date.
   */
  ngOnInit() {
    this.actualDate = DateHelper.getDate();
    this.getSpecifiedDates();
  }

  /**
   * Method that will retrieve the specified dates from the specified start/end range.
   */
  private getSpecifiedDates() {
    this.unsubscribeItems();

    this.startDate = DateHelper.getStartOfType(this.actualDate, this.tableDisplayType);
    this.endDate = DateHelper.getEndOfType(this.actualDate, this.tableDisplayType);

    this.manageDayService.getDayMenus(this.startDate, this.endDate);
    const dayMenusSubs = this.manageDayService.dayMenuDataChanged.subscribe((dayMenus: DayMenuModel[]) => {
      dayMenus.sort((day1, day2) => {
        return DateHelper.getDate(day1.date).dayOfYear() - DateHelper.getDate(day2.date).dayOfYear();
      });

      for (
        const date = DateHelper.getDate(this.startDate); date.isBefore(this.endDate); date.add(1, 'days')
      ) {
        if (DateHelper.isWeekend(date)) {
          continue;
        }

        const dayMenuResult = dayMenus.find(
          (dayMenu: DayMenuModel) => DateHelper.getDate(dayMenu.date).dayOfYear() === date.dayOfYear()
        );

        const actualDayMenu = dayMenuResult === undefined ?
          new DayMenuModel(Constants.statusTypes.OPEN.key, date)
          : dayMenuResult;
        this.sortData(actualDayMenu.menus, 'meal.name');
        this.dayMenus.push(actualDayMenu);
      }
      console.log(this.dayMenus);
    });
    this.subscriptions.push(dayMenusSubs);
  }

  /**
   * Method that will retrieve a day menu from specific date .
   */
  private getSpecifiedDate(dateStart, dateEnd?) {
    this.unsubscribe();

    if (dateEnd === undefined) {
      dateEnd = dateStart;
    }

    this.manageDayService.getDayMenu(dateStart, dateEnd);
    const simpleDayMenuSubs = this.manageDayService.simpleDayMenuDataChanged.subscribe((dayMenus: DayMenuModel[]) => {
      for (const dayMenu of dayMenus) {
        const indexOldDayMenu = this.dayMenus.findIndex(dMenu =>
          DateHelper.getFormattedDate(dMenu.date) === DateHelper.getFormattedDate(dayMenu.date));
        this.dayMenus[indexOldDayMenu] = dayMenu;
      }
    });

    this.subscriptions.push(simpleDayMenuSubs);
  }

  /**
   * Method that will display the selected menu.
   * @param menu Menu to display.
   */
  private onViewMenuClick(menu: MenuModel) {
    const viewMenuRef = this.modalService.open(MenuViewComponent, { size: 'lg' });
    viewMenuRef.componentInstance.selectedMenu = menu;
  }

  /**
   * Method that will display the Create Modal Form.
   */
  public onCreateMenuClick() {
    this.onCreateAndAddMenuClick(undefined);
  }

  /**
   * Method that will create and add a new menu. Will show a modal.
   * @param dayMenu Day menu to add from.
   */
  private onCreateAndAddMenuClick(dayMenu: DayMenuModel) {
    if (this.isActionDisabled(dayMenu)) {
      return;
    }

    const addModalRef = this.modalService.open(MenuCreateComponent, { size: 'lg' });
    addModalRef.result.then((menu: MenuModel) => {
      if (menu !== null && menu !== undefined) {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido creado correctamente.`
        );
        if (dayMenu !== null && dayMenu !== undefined) {
          this.getSpecifiedDate(dayMenu.date);
          this.onUploadMenuClick(dayMenu, menu);
        }
      }
    }, () => {});
  }

  /**
   * Method that will add a new menu. Will show a modal.
   * @param dayMenu Day menu to upload from.
   * @param selectedMenu Selected menu to upload from.
   */
  private onUploadMenuClick(dayMenu: DayMenuModel, selectedMenu?: MenuModel) {
    if (this.isActionDisabled(dayMenu)) {
      return;
    }

    const uploadModalRef = this.modalService.open(MenuUploadComponent, { size: 'lg' });
    uploadModalRef.componentInstance.dayMenu = dayMenu;
    uploadModalRef.componentInstance.selectedMenu = selectedMenu;
    uploadModalRef.result.then((menu: MenuModel) => {
      if (menu !== null && menu !== undefined) {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido agregado correctamente al día ${DateHelper.getFormattedDate(dayMenu.date)}.`
        );
        this.getSpecifiedDate(dayMenu.date);
      }
    }, () => {});
  }

  /**
   * Method that will delete the menu. Will show a modal.
   * @param dayMenu Day menu to delete from.
   * @param menu Menu to delete.
   */
  private onDeleteMenuClick(dayMenu: DayMenuModel, menu: MenuModel) {
    if (this.isActionDisabled(dayMenu)) {
      return;
    }

    const deleteMenuRef = this.modalService.open(AlertSimpleComponent, { size: 'lg' });
    deleteMenuRef.componentInstance.content = {
      title: '¿Borrar menú?',
      description:
        `¿Estás seguro de borrar el menú "<i>${menu.title}</i>" del día <i><b>${DateHelper.getLongFormattedDate(dayMenu.date)}</i></b>?`,
      cancelText: 'Cancel',
      confirmationText: 'Sí'
    };

    deleteMenuRef.result.then(() => {
      this.manageDayService.deleteMenu(dayMenu, menu).subscribe((response) => {
        console.log(response);
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido eliminado correctamente del día ${DateHelper.getFormattedDate(dayMenu.date)}.`
        );
        this.getSpecifiedDate(dayMenu.date);
      });
    }, () => {});
  }

  /**
   * Method that will publish the actual week.
   */
  private onPublishWeek() {
    if (this.tableDisplayType !== Constants.displayTypes.WEEK) {
      return;
    }

    const publishModalRef = this.modalService.open(OverviewFormManageComponent, { size: 'lg' });
    publishModalRef.componentInstance.startOfWeek = this.startDate;
    publishModalRef.componentInstance.endOfWeek = this.endDate;
    publishModalRef.componentInstance.dayMenus = this.dayMenus;

    publishModalRef.result.then(() => {
      this.getSpecifiedDate(this.startDate, this.endDate);
    }, () => {});
  }

  /**
   * Method that will display the data based on the DisplayType.
   * @param displayType Display Type to display data: DAY, WEEK, MONTH, YEAR.
   */
  public displayData(displayType) {
    this.tableDisplayType = displayType;
    this.getSpecifiedDates();
  }

  /**
   * Method that will return the sorted data based on the type of sort.
   * @param menus Menus to sort.
   * @param id Which ID to sort.
   */
  private sortData(menus: MenuModel[], id: string): void {
    this.tableSortDesc = !this.tableSortDesc;
    menus.sort((elementA: MenuModel, elementB: MenuModel) => {
      return this.tableSortDesc
        ? elementB.getElementByID(id).localeCompare(elementA.getElementByID(id))
        : elementA.getElementByID(id).localeCompare(elementB.getElementByID(id));
    });
  }

  public getPreviousDate() {
    this.actualDate = DateHelper.getPreviousDateType(this.actualDate, this.tableDisplayType);
    this.getSpecifiedDates();
  }

  public getNextDate() {
    this.actualDate = DateHelper.getNextDateType(this.actualDate, this.tableDisplayType);
    this.getSpecifiedDates();
  }

  private getActualDate(dayMenu: DayMenuModel) {
    return DateHelper.getLongFormattedDate(dayMenu.date);
  }

  get getActualDateRange() {
    return `${DateHelper.getLongFormattedDate(this.startDate)} - ${DateHelper.getLongFormattedDate(this.endDate)}`;
  }

  /**
   * Method that unsubscribe and reset values.
   */
  private unsubscribeItems() {
    this.dayMenus = [];
    this.unsubscribe();
  }

  private unsubscribe() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribeItems();
  }

}
