import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {AuthenticationService} from '../../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from 'src/app/_helpers/constants';
import {DayMenuModel} from '../../common/models/day-menu.model';
import {UserMenuModel} from '../../common/models/user-menu.model';
import {PlanningDayService} from './planning-day.service';
import {NotifierService} from 'angular-notifier';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {plainToClass} from 'class-transformer';
import {DateHelper} from '../../_helpers/date-helper';
import {AlertSimpleComponent} from '../../common/forms/common-forms/alert-simple/alert-simple.component';

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-day.component.html',
  styleUrls: ['./planning-day.component.less']
})
export class PlanningDayComponent implements OnInit, OnDestroy, AfterViewInit {

  actualDate: string;

  currentUser: any;

  userMenu: UserMenuModel = null;
  dayMenu: DayMenuModel = null;

  selectedMenus = {};
  selectedTab = '';

  subscriptions = [];

  protected isApproved = () => this.userMenu.status === Constants.statusTypes.APPROVED.key;
  public isButtonDisabled = () => this.userMenu && (this.isApproved() || !this.menusReady(1));

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected authenticationService: AuthenticationService,
    protected planningDetailService: PlanningDayService,
    protected modalService: NgbModal,
    protected readonly notifier: NotifierService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    const routeParams = this.route.snapshot.paramMap;
    this.actualDate = `${routeParams.get('year')}-${routeParams.get('month')}-${routeParams.get('day')}`;
  }

  ngOnInit() {
    this.unsubscribe();
    this.getDayMenus();
    for (const constantKey of Constants.mealConstants) { this.selectedMenus[`${constantKey}`] = []; }
  }

  /**
   * Method to get user menus.
   */
  protected getDayMenus() {
    this.planningDetailService.getDayMenu(this.currentUser.userId, this.actualDate);

    const planningSubscription = this.planningDetailService.dayMenuDataChanged.subscribe((dayMenuResult: any) => {
      this.dayMenu = plainToClass(DayMenuModel, dayMenuResult.dayMenu);
      this.userMenu = plainToClass(UserMenuModel, dayMenuResult.userMenu);

      this.selectDefaultUserMenus();
    });

    this.subscriptions.push(planningSubscription);
  }

  ngAfterViewInit() {
    this.validateTime();
  }

  /**
   * Method that selects user menus already selected (if exists).
   */
  protected selectDefaultUserMenus() {
    if (this.userMenuExists && this.dayMenuExists) {
      for (const userMenu of this.userMenu.menus) {
        this.onItemClicked(userMenu, true);
      }
    } else {
      this.userMenu = new UserMenuModel(Constants.statusTypes.NA.key);
    }
  }

  /**
   * Method that uploads the selected dayMenus.
   */
  protected uploadMenu() {
    const menuIds = [];

    for (const meal of Constants.mealConstants) {
      for (const menu of this.selectedMenus[`${meal}`]) {
        menuIds.push(menu);
      }
    }

    const postMenuSubscription = this.planningDetailService.postMenus(
      this.currentUser.userId, this.userMenu.date, menuIds
    ).subscribe((response: any) => {
      if (response.result.status === 'OK') {
        this.router.navigate(['/']).then(() => {
          this.notifier.hideAll();
          this.notifier.notify(
            'success',
            `El menu del día ${DateHelper.getFormattedDateFromString(this.actualDate)} ha sido agregado correctamente.`
          );
        });
      } else {
        this.notifier.notify('error', 'Ups! Hubo un error. Intenta de nuevo.');
      }
    });
    this.subscriptions.push(postMenuSubscription);
  }

  /**
   * Method that checks if the day menu exists in server.
   */
  get dayMenuExists() {
    return this.dayMenu !== null && this.dayMenu !== undefined;
  }

  /**
   * Method that checks if the user menu exists in server.
   */
  get userMenuExists() {
    return this.userMenu !== null && this.userMenu !== undefined;
  }

  /**
   * Method that checks if the user menu exists in server.
   */
  get userMenuExistsAndAvailable() {
    return this.userMenuExists && this.userMenu.id !== undefined;
  }

  /**
   * Method that checks if 2 and above menus are selected.
   */
  public menusReady(menusRequired) {
    let amountMenus = 0;
    for (const mealId of Constants.mealConstants) {
      amountMenus += this.selectedMenus[mealId].length;
    }
    return amountMenus >= menusRequired;
  }

  /**
   * Method that sets the actual tab.
   * @param tabId Actual tab ID.
   */
  onTabChanged(tabId) {
    this.selectedTab = tabId;
  }

  /**
   * Method that has the listener if date was changed in child.
   * @param date Date changed.
   */
  public onDateChanged(date) {
    this.actualDate = date;
    this.router.navigate([`/planning/${DateHelper.getFormattedDate(date)}`]);

    this.ngOnInit();
  }

  /**
   * Method that adds the menu to the selected list.
   * @param menu MenuModel clicked.
   * @param settingDefault Flag to check if this is a default fill.
   */
  public onItemClicked(menu, settingDefault?) {
    const menuId = menu.id;
    const mealId = menu.meal.code;

    let selectedMenus = this.selectedMenus[`${mealId}`];
    const menuIndex = selectedMenus.indexOf(menuId);

    // TODO : change based on role
    if (this.currentUser.role !== Constants.userTypes.GUEST.key) {
      selectedMenus = [];
    } else if (this.currentUser.role !== Constants.userTypes.ADMIN.key)  {
      return;
    }

    if (settingDefault !== undefined || !this.isApproved()) {
      if (menuIndex === -1) {
        selectedMenus.push(menuId);
      } else {
        selectedMenus.splice(menuIndex, 1);
      }

      this.selectedMenus[`${mealId}`] = selectedMenus;
    }
  }

  /**
   * Method that validates the selected dayMenus.
   */
  public validateUploadMenus() {
    const amountBreakfast = this.selectedMenus[`${Constants.mealsTypes.BREAKFAST.key}`].length;
    const amountLunches = this.selectedMenus[`${Constants.mealsTypes.LUNCH.key}`].length;
    const amountDinners = this.selectedMenus[`${Constants.mealsTypes.DINNER.key}`].length;

    const amountOfMenus = amountBreakfast + amountLunches + amountDinners;

    if (amountOfMenus > 2) {
      const errorAlert = this.modalService.open(AlertSimpleComponent, {size: 'lg'});
      errorAlert.componentInstance.content = {
        title: 'Solo puedes seleccionar hasta 2 comidas.',
        description: 'Revisa tus comidas, por favor.',
        cancelText: 'OK',
        confirmationText: ''
      };
      return;
    }

    if (amountDinners > 0 && (amountBreakfast > 0 || amountLunches > 0)) {
      const errorAlert = this.modalService.open(AlertSimpleComponent, {size: 'lg'});
      errorAlert.componentInstance.content = {
        title: 'Solo puedes seleccionar 1 cena o, 1 desayuno y 1 almuerzo.',
        description: 'Revisa tus comidas, por favor.',
        cancelText: 'OK',
        confirmationText: ''
      };
      return;
    }

    if (this.validateTime() || this.isApproved()) {
      return;
    }

    // If all validations are fine, then add a confirmation modal.
    const confirmationAlert = this.modalService.open(AlertSimpleComponent, {size: 'lg'});
    confirmationAlert.componentInstance.content = {
      title: '¿Deseas continuar?',
      description:
        `<b>Por favor revisa tus comidas.</b> Elige con cuidado.`,
      cancelText: 'Cancelar',
      confirmationText: 'Continuar'
    };
    confirmationAlert.result.then(() => {
        this.uploadMenu();
      },
      () => {
      });
  }

  /**
   * Method that will validate the actual time.
   * Checks if date is Wednesday, Thursday and Friday.
   * Checks if actual time is in 06:00 to 23:00.
   * Will show dialog if something is wrong.
   */
  protected validateTime() {
    const actualDate = DateHelper.getDate();

    const actualDayOfWeek = DateHelper.getDayOfWeek(actualDate);
    const actualTime = actualDate.hours();

    if ((actualDayOfWeek > 2 && actualDayOfWeek < 5)
      && (actualTime > 6 && actualTime < 23)) {
      return false;
    }

    const errorAlert = this.modalService.open(AlertSimpleComponent, {backdrop: 'static', size: 'lg'});
    errorAlert.componentInstance.content = {
      title: 'Horario no válido',
      description:
        `El horario para seleccionar comidas son los días <i>Miércoles, Jueves y Viernes</i> de <b>06:00 a 23:00 horas</b>. 
<br><br>Vuelve más tarde.`,
      cancelText: '',
      confirmationText: 'OK'
    };
    errorAlert.result.then(() => {
      this.router.navigate(['/']);
    }, () => {
      this.router.navigate(['/']);
    });

    return true;
  }

  private unsubscribe() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

}
