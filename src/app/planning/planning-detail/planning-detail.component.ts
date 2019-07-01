import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from 'src/app/_helpers/constants';
import {DayMenu} from '../../_models/DayMenu';
import {UserMenu} from '../../_models/UserMenu';
import {PlanningDetailService} from './planning-detail.service';
import {NotifierService} from 'angular-notifier';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {plainToClass} from 'class-transformer';
import {DateHelper} from '../../_models/DateHelper';

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-detail.component.html',
  styleUrls: ['./planning-detail.component.less']
})
export class PlanningDetailComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', {static: true}) modalElement;

  actualDate: string;

  currentUser: any;

  userMenu: UserMenu = null;
  dayMenu: DayMenu = null;

  modalMessage: any = {};

  subscriptions = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private planningDetailService: PlanningDetailService,
    private modalService: NgbModal,
    private readonly notifier: NotifierService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.actualDate = `${routeParams.get('year')}-${routeParams.get('month')}-${routeParams.get('day')}`;

    this.planningDetailService.getDayMenu(this.currentUser.userId, this.actualDate);

    const planningSubscription = this.planningDetailService.dayMenuDataChanged.subscribe((dayMenuResult: any) => {
      this.dayMenu = plainToClass(DayMenu, dayMenuResult.dayMenu);
      this.userMenu = plainToClass(UserMenu, dayMenuResult.userMenu);
    });

    this.subscriptions.push(planningSubscription);
  }

  /**
   * Method that uploads the selected dayMenus.
   */
  private onUploadMenu(selectedMenus) {
    const menuIds = [];

    for (const meal of Constants.mealConstants) {
      for (const menu of selectedMenus[`${meal}`]) {
        menuIds.push(menu);
      }
    }

    const postMenuSubscription = this.planningDetailService.postMenus(
      this.currentUser.userId, this.userMenu.date, menuIds
    ).subscribe((response: any) => {
      this.planningDetailService.loading = false;
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
   * Method that validates the selected dayMenus.
   */
  private validateMenus(selectedMenus) {
    const amountBreakfast = selectedMenus[`${Constants.breakfastKey.key}`].length;
    const amountLunches = selectedMenus[`${Constants.lunchKey.key}`].length;
    const amountDinners = selectedMenus[`${Constants.dinnerKey.key}`].length;

    const amountOfMenus = amountBreakfast + amountLunches + amountDinners;

    // TODO : verify if we need to validate breakfast/lunches/dinners above 2.
    if (amountOfMenus !== 2) {
      this.modalMessage = {
        title: 'No has seleccionado tus 2 comidas.', message: 'Revisa tus comidas, por favor.',
        positiveMessage: '', isPositiveButtonPresent: false,
        neutralMessage: '', isNeutralButtonPresent: false,
        negativeMessage: 'OK', isNegativeButtonPresent: true
      };
      this.modalService.open(this.modalElement, {ariaLabelledBy: 'modalElement-basic-title'});
      return;
    }

    // If all validations are fine, then add a confirmation modal.
    this.modalMessage = {
      title: '¿Deseas continuar?', message: 'Las comidas no podrán ser cambiadas. Elige con cuidado.',
      positiveMessage: 'Continuar', isPositiveButtonPresent: true,
      neutralMessage: '', isNeutralButtonPresent: false,
      negativeMessage: 'Cancelar', isNegativeButtonPresent: true
    };
    this.modalService.open(this.modalElement, {ariaLabelledBy: 'modalElement-basic-title'}).result.then( (result) => {
      if (result === 'continue') { this.onUploadMenu(selectedMenus); }
      }, () => {}
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
