import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateHelper} from '../../_helpers/date-helper';
import {DayMenuModel} from '../../common/models/day-menu.model';
import {MenuModel} from '../../common/models/menu.model';
import {Constants} from '../../_helpers/constants';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MenuCreateComponent} from '../../common/forms/menu-forms/menu-add/menu-create.component';
import {MenuUploadComponent} from '../../common/forms/menu-forms/menu-upload/menu-upload.component';
import {NotifierService} from 'angular-notifier';
import {ManageService} from '../manage.service';
import {AlertSimpleComponent} from '../../common/forms/common-forms/alert-simple/alert-simple.component';
import {MenuViewComponent} from '../../common/forms/menu-forms/menu-view/menu-view.component';

@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.less']
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

  isNotPublished  = (status: string) => status !== Constants.statusTypes.OPEN.key;
  isPublished     = (status: string) => status === Constants.statusTypes.OPEN.key;
  statusText      = (status: string) => Constants.statusTypes[`${status.toUpperCase()}`].message;

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
        const dayMenuResult = dayMenus.find(
          (dayMenu: DayMenuModel) => DateHelper.getDate(dayMenu.date).dayOfYear() === date.dayOfYear()
        );

        const actualDayMenu = dayMenuResult === undefined ?
          new DayMenuModel(Constants.statusTypes.OPEN.key, date)
          : dayMenuResult;
        this.sortData(actualDayMenu.menus, 'title');
        this.dayMenus.push(actualDayMenu);
      }
    });
    this.subscriptions.push(dayMenusSubs);
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
  private onCreateMenuClick() {
    this.onCreateAndAddMenuClick(undefined);
  }

  /**
   * Method that will create and add a new menu. Will show a modal.
   * @param dayMenu Day menu to add from.
   */
  private onCreateAndAddMenuClick(dayMenu: DayMenuModel) {
    const addModalRef = this.modalService.open(MenuCreateComponent, { size: 'lg' });
    addModalRef.result.then((menu: MenuModel) => {
      if (menu !== null && menu !== undefined) {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido creado correctamente.`
        );
        if (dayMenu !== null && dayMenu !== undefined) {
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
    const uploadModalRef = this.modalService.open(MenuUploadComponent, { size: 'lg' });
    uploadModalRef.componentInstance.dayMenu = dayMenu;
    uploadModalRef.componentInstance.selectedMenu = selectedMenu;
    uploadModalRef.result.then((menu: MenuModel) => {
      if (menu !== null && menu !== undefined) {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido agregado correctamente al día ${DateHelper.getFormattedDate(dayMenu.date)}.`
        );
        this.getSpecifiedDates();
      }
    }, () => {});
  }

  /**
   * Method that will delete the menu. Will show a modal.
   * @param dayMenu Day menu to delete from.
   * @param menu Menu to delete.
   * TODO : change to simple alert.
   */
  private onDeleteMenuClick(dayMenu: DayMenuModel, menu: MenuModel) {
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
        this.getSpecifiedDates();
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

    const publishWeekRef = this.modalService.open(AlertSimpleComponent, { size: 'lg' });
    publishWeekRef.componentInstance.content = {
      title: '¿Publicar semana?',
      description: `¿Estás seguro de publicar la semana <b><i>${this.getActualDateRange}</i></b>?`,
      cancelText: 'Cancelar',
      confirmationText: 'OK'
    };

    publishWeekRef.result.then(() => {
      this.manageDayService.publishWeek(this.startDate).subscribe((response) => {
        console.log(response);
        this.notifier.notify(
          'success',
          `La semana ${this.getActualDateRange} ha sido publicada.`
        );
        this.getSpecifiedDates();
      });
    }, () => {});
  }

  /**
   * Method that will display the data based on the DisplayType.
   * @param displayType Display Type to display data: DAY, WEEK, MONTH, YEAR.
   */
  private displayData(displayType) {
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

  /**
   * Method that will set the dates based on the table to display.
   */
  private getPreviousDate() {
    this.actualDate = DateHelper.getPreviousDateType(this.actualDate, this.tableDisplayType);
    this.getSpecifiedDates();
  }

  /**
   * Method that will set the dates based on the table to display.
   */
  private getNextDate() {
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
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribeItems();
  }

}
