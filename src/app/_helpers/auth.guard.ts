import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';

/**
 * Injectable typescript that will handle all the verifications if the user tries to reach a page he's not allowed.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.router = router;
    this.authenticationService = authenticationService;
  }

  /**
   * Method that checks if the user is active, if not return to login page.
   * @param route Route of the application.
   * @param state Current router state.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) { return true; }

    this.router.navigate(['/login-qr'], { queryParams: { returnUrl : state.url}});
    return false;
  }

}
