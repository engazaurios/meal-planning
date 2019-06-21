import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from '../_services';

/**
 * Injectable class that will handle all the verifications if the user tries to reach a page he's not allowed.
 */

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.router = router;
    this.authenticationService = authenticationService;
  }

  // Method that checks if the user is active, if not return to login page.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) { return true; }

    this.router.navigate(['/login'], { queryParams: { returnUrl : state.url}});
    return false;
  }

}
