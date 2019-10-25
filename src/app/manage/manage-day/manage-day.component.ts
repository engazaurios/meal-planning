import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';

import {PlanningDayComponent} from '../../planning/planning-day/planning-day.component';
import {UserMenuModel} from 'src/app/common/models/user-menu.model';
import {Constants} from '../../_helpers/constants';
import {MenuModel} from '../../common/models/menu.model';
import {DayMenuModel} from 'src/app/common/models/day-menu.model';
import {MenuCreateComponent} from 'src/app/common/forms/menu-forms/menu-create/menu-create.component';
import {MenuUploadComponent} from 'src/app/common/forms/menu-forms/menu-upload/menu-upload.component';
import {AlertSimpleComponent} from '../../common/forms/common-forms/alert-simple/alert-simple.component';
import {DateHelper} from '../../_helpers/date-helper';
import {ManageService} from '../manage.service';

@Component({
  selector: 'app-manage-day',
  templateUrl: './manage-day.component.html',
  styleUrls: ['./manage-day.component.less']
})
export class ManageDayComponent extends PlanningDayComponent implements OnInit, OnDestroy {

  selectedMenu: MenuModel;

  isApproved = () => this.dayMenu && this.dayMenu.status === Constants.statusTypes.APPROVED.key;
  isButtonDisabled = () => this.dayMenu && this.isApproved();

  constructor(route: ActivatedRoute,
              router: Router,
              authenticationService: AuthenticationService,
              modalService: NgbModal, notifier: NotifierService,
              protected manageService: ManageService) {
    super(route, router, authenticationService, manageService, modalService, notifier);
  }

  /**
   * Method to get day menus.
   */
  protected getDayMenus() {
    this.manageService.getDayMenus(this.actualDate, this.actualDate);

    const planningSubscription = this.manageService.dayMenuDataChanged.subscribe((dayMenuResult: DayMenuModel[]) => {
      this.dayMenu = dayMenuResult[0];
      this.selectDefaultUserMenus();
    });

    this.subscriptions.push(planningSubscription);
  }

  /**
   * Method that will select the default user menus.
   */
  protected selectDefaultUserMenus() {
    let status;
    if (this.isWeekend) {
      status = Constants.statusTypes.NA.key;
      this.dayMenu = new DayMenuModel(status, this.actualDate);
    } else if (this.dayMenu === null || this.dayMenu === undefined) {
      status = Constants.statusTypes.OPEN.key;
      this.dayMenu = new DayMenuModel(status, this.actualDate);
    } else {
      status = this.dayMenu.status;
    }
    this.userMenu = new UserMenuModel(status);

    this.validateTime();
  }

  /**
   * Method that will create and add a new menu. Will show a modal.
   * @param dayMenu Day menu to add from.
   */
  onAddMenuClick(dayMenu: DayMenuModel) {
    const addModalRef = this.modalService.open(MenuCreateComponent, { size: 'lg' });
    addModalRef.componentInstance.dayMenu = dayMenu;
    addModalRef.result.then((menu: MenuModel) => {
      if (menu !== null && menu !== undefined) {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido creado correctamente.`
        );
        this.onUploadMenuClick(dayMenu, menu);
      }
    }, () => {});
  }

  /**
   * Method that will add a new menu. Will show a modal.
   * @param dayMenu Day menu to upload from.
   * @param menuToUpload Menu to upload (if required).
   */
  onUploadMenuClick(dayMenu: DayMenuModel, menuToUpload?: MenuModel) {
    const uploadModalRef = this.modalService.open(MenuUploadComponent, { size: 'lg' });
    uploadModalRef.componentInstance.dayMenu = dayMenu;
    uploadModalRef.componentInstance.selectedMeal = this.selectedTab;
    uploadModalRef.componentInstance.selectedMenu = menuToUpload;
    uploadModalRef.result.then((menu: MenuModel) => {
      if (menu !== null && menu !== undefined) {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido agregado correctamente.`
        );
        this.reloadMenuItems();
        this.selectedTab = menu.meal.id;
      }
    }, () => {});
  }

  /**
   * Method that will delete the menu. Will show a modal.
   * @param dayMenu Day menu to delete from.
   * @param menu Menu to delete.
   */
  onDeleteMenuClick(dayMenu: DayMenuModel, menu: MenuModel) {
    const deleteMenuRef = this.modalService.open(AlertSimpleComponent, { size: 'lg' });
    deleteMenuRef.componentInstance.content = {
      title: '¿Borrar menú?',
      description:
        `¿Estás seguro de borrar el menú "<i>${menu.title}</i>" del día <i><b>${DateHelper.getLongFormattedDate(dayMenu.date)}</i></b>?`,
      cancelText: 'Cancel',
      confirmationText: 'Sí'
    };

    deleteMenuRef.result.then(() => {
      this.planningDetailService.deleteMenu(dayMenu, menu).subscribe((response) => {
        this.notifier.notify(
          'success',
          `El menu "${menu.title}" ha sido eliminado correctamente.`
        );
        this.reloadMenuItems();
      });
    });
  }

  /**
   * Method that will change the url and reload its content when next/previous button is clicked.
   * @param date Date changed.
   */
  public onDateChanged(date) {
      this.actualDate = date;
      this.router.navigate([`/manage/${DateHelper.getFormattedDate(date)}`]);
      this.reloadMenuItems();
  }

  /**
   * Method that will do an action when an item is clicked.
   * @param menu Menu item clicked.
   */
  public onItemClicked(menu) {
    const alreadySelected = this.selectedMenus[`${menu.meal.code}`].indexOf(menu.id) !== -1;
    for (const constantKey of Constants.mealConstants) { this.selectedMenus[`${constantKey}`] = []; }
    this.selectedMenu = null;
    if (!alreadySelected && !this.isApproved()) {
      this.selectedMenus[`${menu.meal.code}`] = [menu.id];
      this.selectedMenu = menu;
    }
  }

  /**
   * Method that will return that the default user is already created.
   */
  get userMenuExists(): boolean {
    return this.userMenu !== null && this.userMenu !== undefined;
  }

  /**
   * Method that will return if the user exists.
   */
  get userMenuExistsAndAvailable(): boolean {
    return this.userMenuExists;
  }

  /**
   * Method that will check if the dayMenu week is in weekend.
   */
  get isWeekend() {
    return DateHelper.isWeekend(this.actualDate);
  }

  /**
   * Disable method to validate time.
   */
  protected validateTime(): boolean {
    const dayBefore = DateHelper.getPreviousDateType(DateHelper.getDate(), Constants.displayTypes.DAY).dayOfYear();
    const actualDayMenuDay = DateHelper.getDate(this.dayMenu.date).dayOfYear();
    if (actualDayMenuDay > dayBefore) {
      return false;
    }

    const errorAlert = this.modalService.open(AlertSimpleComponent, {backdrop: 'static', size: 'lg'});
    errorAlert.componentInstance.content = {
      title: 'Fecha no válida',
      description:
        `No puedes agregar menús de hace una semana. <br><i>Consulta a tu administrador.</i>`,
      cancelText: '',
      confirmationText: 'OK'
    };
    errorAlert.result.then(() => {
      this.router.navigate(['/manage']);
    }, () => {
      this.router.navigate(['/manage']);
    });

    return true;
  }

  /**
   * Method that will reload Items in component.
   */
  private reloadMenuItems() {
    this.selectedMenu = null;
    this.ngOnInit();
  }

}
