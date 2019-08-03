import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DayMenuModel} from '../models/day-menu.model';
import {UserMenuModel} from '../models/user-menu.model';
import {Constants} from '../../_helpers/constants';
import {MealModel} from '../models/meal.model';
import {MenuListService} from './menu-list.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.less']
})
export class MenuListComponent implements OnInit, OnDestroy {

  mealConstants = Constants.mealConstants;

  @Input() showHeader: boolean;
  @Input() showItems: boolean;

  @Input() currentUser: any;
  @Input() actualDate: any;

  @Input() dayMenu: DayMenuModel = null;
  @Input() userMenu: UserMenuModel = null;

  @Input() selectedMenus = {};

  @Output() dateChanged       = new EventEmitter<string>();
  @Output() itemClickedEvent  = new EventEmitter<any>();

  meals = [];

  subscriptions = [];

  constructor(
    protected menuListService: MenuListService
  ) { }

  ngOnInit() {
    const mealSubscription = this.menuListService.mealDataChanged.subscribe((meals: MealModel[]) => {
      this.meals = meals;
    });
    this.menuListService.getMeals();
    this.subscriptions.push(mealSubscription);
  }

  /**
   * Method that returns if the menu is selected.
   * @param menu MenuModel to check.
   */
  private isSelected(menu) {
    return this.selectedMenus[`${menu.meal.code}`].indexOf(menu.id) !== -1;
  }

  /**
   * Method that returns a boolean value if menu was selected.
   * @param menu MenuModel clicked.
   */
  private onMenuClicked(menu) {
    this.itemClickedEvent.emit(menu);
  }

  /**
   * Method that returns the date changed.
   * @param date Date changed.
   */
  private onDateChanged(date) {
    this.dateChanged.emit(date);
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

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
