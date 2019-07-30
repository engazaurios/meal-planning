import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DayMenu} from '../../_models/DayMenu';
import {UserMenu} from '../../_models/UserMenu';
import {Constants} from '../../_helpers/constants';
import {Meal} from '../../_models/Meal';
import {MenuListService} from './menu-list.service';
import {plainToClass} from 'class-transformer';
import {PlanningDetailService} from '../../planning/planning-detail/planning-detail.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.less']
})
export class MenuListComponent implements OnInit, OnDestroy {

  mealConstants = Constants.mealConstants;

  @Input() currentUser: any;
  @Input() actualDate: any;
  @Input() loading: boolean;

  @Input() dayMenu: DayMenu = null;
  @Input() userMenu: UserMenu = null;

  @Output() onActionClickedEvent = new EventEmitter<any>();

  selectedMenus = {};
  meals = [];

  subscriptions = [];

  constructor(
    private menuListService: MenuListService,
    private planningDetailService: PlanningDetailService
  ) { }

  ngOnInit() {
    const mealSubscription = this.menuListService.mealDataChanged.subscribe((meals: Meal[]) => {
      this.meals = meals;
    });
    this.menuListService.getMeals();

    const planningSubscription = this.planningDetailService.dayMenuDataChanged.subscribe((dayMenuResult: any) => {
      this.dayMenu = plainToClass(DayMenu, dayMenuResult.dayMenu);
      this.userMenu = plainToClass(UserMenu, dayMenuResult.userMenu);

      if (this.userMenuExists() && this.dayMenuExists()) {
        for (const userMenu of this.userMenu.menus) {
          this.onMenuClicked(userMenu);
        }
      } else {
        this.userMenu = new UserMenu();
      }
    });

    for (const constantKey of this.mealConstants) { this.selectedMenus[`${constantKey}`] = []; }

    this.subscriptions.push(mealSubscription);
    this.subscriptions.push(planningSubscription);
  }

  /**
   * Method that returns if the menu is selected.
   * @param menu Menu to check.
   */
  private isSelected(menu) {
    return this.selectedMenus[`${menu.meal.code}`].indexOf(menu.id) !== -1;
  }

  /**
   * Method that adds the menu to the selected list.
   * @param menu Menu clicked.
   */
  private onMenuClicked(menu) {
    const menuId = menu.id;
    const mealId = menu.meal.code;

    let selectedMenus = this.selectedMenus[`${mealId}`];
    const menuIndex = selectedMenus.indexOf(menuId);

    // TODO : change based on role
    if (this.currentUser.role !== 'guest') {
      selectedMenus = [];
    } else if (this.currentUser.role !== 'admin')  {
      return;
    }

    if (menuIndex === -1) {
      selectedMenus.push(menuId);
    } else {
      selectedMenus.splice(menuIndex, 1);
    }

    this.selectedMenus[`${mealId}`] = selectedMenus;
  }

  /**
   * Method that returns the meals by its code.
   * @param code Code of the meal.
   */
  private getMealNameByCode(code): string {
    for (const meal of this.meals) {
      if (meal.code === code) {
        return meal.name;
      }
    }
    return '';
  }

  /**
   * Method that checks if 2 and above menus are selected.
   */
  private menusReady() {
    let amountMenus = 0;
    for (const mealId of this.mealConstants) {
      amountMenus += this.selectedMenus[mealId].length;
    }
    return amountMenus >= 2;
  }

  /**
   * Method that will execute event emitter to parent.
   */
  private onActionClicked() {
    this.onActionClickedEvent.emit(this.selectedMenus);
  }

  /**
   * Method that checks if the user menu exists in server.
   */
  private userMenuExists() {
    return this.userMenu !== null && this.userMenu !== undefined;
  }

  /**
   * Method that checks if the day menu exists in server.
   */
  private dayMenuExists() {
    return this.dayMenu !== null && this.dayMenu !== undefined;
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
