import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthenticationService} from '../_services';
import {Constants} from './constants';

/**
 * Injectable typescript that will handle all the verifications if the user tries to reach a page he's not allowed.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.router = router;
    this.authenticationService = authenticationService;
  }

  /**
   * Method that checks if the user is the type of user and redirect based on it.
   * @param route Route of the application.
   * @param state Current router state.
   */
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {

    const expectedRoles = route.data.expectedRoles;
    const actualRoles = this.authenticationService.currentUserValue.user.roles;

    let isExpectedRole = false;
    for (const expectedRole of expectedRoles) {
      const isRole = actualRoles.find(r => r.name === expectedRole);
      if (isRole) {
        isExpectedRole = true;
        break;
      }
    }

    if (!isExpectedRole) {
      if (actualRoles.find(r => r.name === Constants.userTypes.ADMIN.key)) {
        this.router.navigate(['/manage']);
      } else {
        this.router.navigate(['/']);
      }
    }
    return isExpectedRole;
  }

}
