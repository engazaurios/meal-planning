import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuCreateComponent} from '../menu-add/menu-create.component';
import {MenuModel} from '../../../models/menu.model';
import {MenuFormsService} from '../menu-forms.service';
import {DateHelper} from 'src/app/_helpers/date-helper';
import {Constants} from '../../../../_helpers/constants';
import {DayMenuModel} from '../../../models/day-menu.model';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['../../forms.component.less']
})
export class MenuUploadComponent extends MenuCreateComponent implements OnInit {

  @Input()  selectedMenu: MenuModel;
  @Input()  dayMenu: DayMenuModel;

  uploadMenuFormGroup: FormGroup;

  allMenusDict: any     = {};
  allMenus: MenuModel[] = [];

  constructor(
    protected activeModal: NgbActiveModal,
    protected formBuilder: FormBuilder,
    protected menuUploadService: MenuFormsService
  ) {
    super(activeModal, formBuilder, menuUploadService);

    this.uploadMenuFormGroup = this.formBuilder.group({
      mealUploadId: ['', Validators.required],
      categoryUploadId: ['', Validators.required],
      menuUploadId: ['', Validators.required]
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.menuUploadService.getAllMenus();
    const menusSubs = this.menuUploadService.menusDataChanged.subscribe((menus: MenuModel[]) => {
      this.allMenus = menus.sort((menuA, menuB) => menuA.title.localeCompare(menuB.title));
      for (const menu of menus) {
        this.allMenusDict[`${menu.id}`] = menu;
      }
    });

    this.validateSelectedMenu();
    this.createDayMenu();

    this.subscriptions.push(menusSubs);
  }

  private validateSelectedMenu() {
    if (this.selectedMenu !== undefined && this.selectedMenu !== null) {
      this.uploadMenuForm.mealUploadId.setValue(this.selectedMenu.mealId);
      this.uploadMenuForm.categoryUploadId.setValue(this.selectedMenu.categoryId);
      this.uploadMenuForm.menuUploadId.setValue(this.selectedMenu.id);
    }
  }

  /**
   * Method that will reset the addMenuForm.
   */
  private onFormChange() {
    this.uploadMenuFormGroup.controls.menuUploadId.reset();
  }

  protected cancelAction() {
    super.cancelAction();
    this.deleteDayMenu();
  }

  protected validate() {
    const menuUploadId = this.uploadMenuForm.menuUploadId;
    if (menuUploadId.invalid || menuUploadId.value === null) {
      return;
    }
    this.uploadMenu(this.allMenusDict[menuUploadId.value]);
  }

  private uploadMenu(menu: MenuModel) {
    this.menuFormsService.uploadMenu(this.dayMenu, menu).subscribe((uploadMenuResponse) => {
      this.menuFormsService.loading = false;
      this.activeModal.close(menu);
    });
  }

  /**
   * Method that creates the day menu.
   * TODO : manage code status.
   */
  private createDayMenu() {
    if (this.dayMenu.status === Constants.statusTypes.OPEN.key) {
      this.menuFormsService.createDayMenu(DateHelper.getDate(this.dayMenu.date));
      const dayMenuSubs = this.menuFormsService.dayMenuDataChanged.subscribe((dayMenu: DayMenuModel) => {
        this.menuFormsService.dayMenuLoading = false;
        this.dayMenu = dayMenu;
      });
      this.subscriptions.push(dayMenuSubs);
    }
  }

  private deleteDayMenu() {
    if (this.dayMenu.menus === undefined || this.dayMenu.menus.length === 0) {
      this.menuFormsService.deleteDayMenu(this.dayMenu);
    }
  }

  /**
   * Method that will return the menus based on the filter.
   * @param mealId Meal name to filter.
   * @param categoryId Category name to filter.
   */
  private getUploadMenusByFilter(mealId, categoryId) {
    const newMenus = [];
    for (const menu of this.allMenus) {
      if (menu.meal.id === mealId && menu.category.id === categoryId) {
        newMenus.push(menu);
      }
    }
    return newMenus;
  }

  /**
   * Method that will return the Menu information.
   * @param id Menu ID.
   */
  private getUploadMenuSelected(id) {
    return this.allMenusDict[id];
  }

  get uploadMenuMealId() {
    return this.uploadMenuForm.mealUploadId.value;
  }

  get uploadMenuCategoryId() {
    return this.uploadMenuForm.categoryUploadId.value;
  }

  get isMenuSelected() {
    return this.uploadMenuForm.menuUploadId.value !== null && this.uploadMenuForm.menuUploadId.value !== '';
  }

  /**
   * Method that will return the uploadMenuForm.
   */
  get uploadMenuForm() {
    return this.uploadMenuFormGroup.controls;
  }

  /**
   * Method that returns the formatted time.
   */
  get formattedDate() {
    return DateHelper.getLongFormattedDate(this.dayMenu.date);
  }

}
