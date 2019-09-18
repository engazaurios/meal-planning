import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryModel} from '../../../models/category.model';
import {MealModel} from '../../../models/meal.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuModel} from '../../../models/menu.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {plainToClass} from 'class-transformer';
import {MenuFormsService} from '../menu-forms.service';
import {Constants} from '../../../../_helpers/constants';
import {FileUploaderService} from '../../../../file-uploader.service';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-create.component.html',
  styleUrls: ['../../forms.component.less']
})
export class MenuCreateComponent implements OnInit, OnDestroy {

  categories: CategoryModel[];
  meals: MealModel[];

  images: string[] = [];
  imageContainer = Constants.imageContainer;
  imageSelected: string;

  isUploading = false;

  formGroup: FormGroup;

  subscriptions = [];

  constructor(
    protected activeModal: NgbActiveModal,
    protected formBuilder: FormBuilder,
    protected menuFormsService: MenuFormsService,
    protected fileUploaderService: FileUploaderService
  ) {
    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      meal: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.menuFormsService.getMeals();
    this.menuFormsService.getCategories();

    const imagesSubs = this.fileUploaderService.getImages(this.imageContainer).subscribe((images: any[]) => {
      for (const image of images) {
        this.images.push(image.name);
      }
      this.imageSelected = images[0].name;
    });
    const categorySubs = this.menuFormsService.categoriesDataChanged.subscribe((categories: CategoryModel[]) => {
      this.categories = plainToClass(CategoryModel, categories);
    });
    const mealSubs = this.menuFormsService.mealDataChanged.subscribe((meals: MealModel[]) => {
      this.meals = plainToClass(MealModel, meals);
    });

    this.subscriptions.push(categorySubs, mealSubs, imagesSubs);
  }

  /**
   * Method that will validate the menus and upload it.
   * TODO : do a more deeply validation.
   */
  public validate() {
    if (this.formGroup.invalid) {
      return;
    }

    const newMenuTitle        = this.addMenuForm.title.value;
    const newMenuDescription  = this.addMenuForm.description.value;
    const newMenuMealId       = this.addMenuForm.meal.value;
    const newMenuCategoryId   = this.addMenuForm.category.value;

    const newMenu = new MenuModel(
      newMenuTitle, newMenuDescription,
      newMenuMealId, newMenuCategoryId,
      this.imageSelected
    );

    this.isUploading = true;
    this.menuFormsService.createMenu(newMenu).subscribe((createMenuResponse) => {
      this.isUploading = false;
      this.activeModal.close(plainToClass(MenuModel, createMenuResponse));
    });
  }

  public cancelAction() {
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
