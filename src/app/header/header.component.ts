import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

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
    this.router.navigate(['/login-qr']);
  }

  ngOnInit(): void {
  }

}
