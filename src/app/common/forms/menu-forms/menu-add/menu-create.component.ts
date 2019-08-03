import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryModel} from '../../../models/category.model';
import {MealModel} from '../../../models/meal.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuModel} from '../../../models/menu.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {plainToClass} from 'class-transformer';
import {MenuFormsService} from '../menu-forms.service';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-create.component.html',
  styleUrls: ['../../forms.component.less']
})
export class MenuCreateComponent implements OnInit, OnDestroy {

  categories: CategoryModel[] = [];
  meals: MealModel[] = [];

  formGroup: FormGroup;

  subscriptions = [];

  constructor(
    protected activeModal: NgbActiveModal,
    protected formBuilder: FormBuilder,
    protected menuFormsService: MenuFormsService
  ) {
    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      meal: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.menuFormsService.getMeals();
    this.menuFormsService.getCategories();

    const categorySubs = this.menuFormsService.categoriesDataChanged.subscribe((categories: CategoryModel[]) => {
      this.categories = plainToClass(CategoryModel, categories);
    });
    const mealSubs = this.menuFormsService.mealDataChanged.subscribe((meals: MealModel[]) => {
      this.meals = plainToClass(MealModel, meals);
    });
    this.subscriptions.push(categorySubs, mealSubs);
  }

  /**
   * Method that will validate the menus and upload it.
   * TODO : do a more deeply validation.
   */
  protected validate() {
    if (this.formGroup.invalid) {
      return;
    }

    const newMenuTitle        = this.addMenuForm.title.value;
    const newMenuDescription  = this.addMenuForm.description.value;
    const newMenuPrice        = this.addMenuForm.price.value;
    const newMenuMealId       = this.addMenuForm.meal.value;
    const newMenuCategoryId   = this.addMenuForm.category.value;

    const newMenu = new MenuModel(
      newMenuTitle, newMenuDescription, newMenuPrice,
      newMenuMealId, newMenuCategoryId
    );

    this.menuFormsService.createMenu(newMenu).subscribe((createMenuResponse) => {
      this.menuFormsService.loading = false;
      this.activeModal.close(plainToClass(MenuModel, createMenuResponse));
    });
  }

  protected cancelAction() {
    this.activeModal.dismiss('cancel');
  }

  /**
   * Method that will return the addMenuForm.
   */
  protected get addMenuForm() {
    return this.formGroup.controls;
  }

  ngOnDestroy(): void {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}