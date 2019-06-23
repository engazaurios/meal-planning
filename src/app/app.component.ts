import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'meal-planning';

  isHeaderCollapsed = true;
  currentUser: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  /**
   * Method that logs out the user by calling the Authentication Service and return it to login.
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
