import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuCreateComponent} from '../menu-create/menu-create.component';
import {MenuModel} from '../../../models/menu.model';
import {MenuFormsService} from '../menu-forms.service';
import {DateHelper} from 'src/app/_helpers/date-helper';
import {Constants} from '../../../../_helpers/constants';
import {DayMenuModel} from '../../../models/day-menu.model';
import {FileUploaderService} from '../../../../file-uploader.service';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['../../forms.component.less']
})
export class MenuUploadComponent extends MenuCreateComponent implements OnInit {

  @Input()  selectedMeal: string;
  @Input()  selectedMenu: MenuModel;
  @Input()  dayMenu: DayMenuModel;

  uploadMenuFormGroup: FormGroup;

  allMenusDict: any     = {};
  allMenus: MenuModel[];

  constructor(
    protected activeModal: NgbActiveModal,
    protected formBuilder: FormBuilder,
    protected menuUploadService: MenuFormsService,
    protected fileUploaderService: FileUploaderService
  ) {
    super(activeModal, formBuilder, menuUploadService, fileUploaderService);

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

  /**
   * Method that will set all the default values.
   */
  private validateSelectedMenu() {
    if (this.selectedMenu !== undefined && this.selectedMenu !== null) {
      this.uploadMenuForm.mealUploadId.setValue(this.selectedMenu.mealId);
      this.uploadMenuForm.categoryUploadId.setValue(this.selectedMenu.categoryId);
      this.uploadMenuForm.menuUploadId.setValue(this.selectedMenu.id);
    } else if (this.selectedMeal !== undefined && this.selectedMeal !== '') {
      this.uploadMenuForm.mealUploadId.setValue(this.selectedMeal);
    }
  }

  /**
   * Method that will reset the addMenuForm.
   */
  public onFormChange() {
    this.uploadMenuFormGroup.controls.menuUploadId.reset();
  }

  /**
   * Method that will dismiss the alert and delete the day menu.
   */
  public cancelAction() {
    super.cancelAction();
    this.deleteDayMenu();
  }

  /**
   * Method that validates the menu to upload.
   */
  public validate() {
    const menuUploadId = this.uploadMenuForm.menuUploadId;
    if (menuUploadId.invalid || menuUploadId.value === null) {
      return;
    }
    this.uploadMenu(this.allMenusDict[menuUploadId.value]);
  }

  /**
   * Method that uploads the selected menu.
   * @param menu Menu to upload.
   */
  private uploadMenu(menu: MenuModel) {
    this.menuFormsService.uploadMenu(this.dayMenu, menu).subscribe((uploadMenuResponse) => {
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
        this.dayMenu = dayMenu;
      });
      this.subscriptions.push(dayMenuSubs);
    }
  }

  /**
   * Method that will delete the day menu.
   */
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
  public getUploadMenusByFilter(mealId, categoryId) {
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
  public getUploadMenuSelected(id) {
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
