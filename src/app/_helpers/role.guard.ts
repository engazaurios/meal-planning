import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Constants } from './constants';

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

    // TODO : verify when there's no role
    // TODO : redirect to 404 if it is not an expected role.

    if (!isExpectedRole) {
      if (actualRoles.find(r => r.name === Constants.userTypes.ADMIN.key)) {
        this.router.navigate(['/manage']);
      } else if (actualRoles.find(r => r.name === Constants.userTypes.PROVIDER.key)) {
        this.router.navigate(['/manage']);
      } else {
        this.router.navigate(['/']);
        isExpectedRole = actualRoles.length > 0;
      }
    }

    return isExpectedRole;
  }

}
