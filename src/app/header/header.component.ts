import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  title = 'Planificación de Comidas';

  session: Observable<any>;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    authService.currentUser.subscribe(session => this.session = session);
  }

  /**
   * Method that logs out the user by calling the Authentication Service and return it to login.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login-qr']);
  }

  get isAdmin() {
    // @ts-ignore
    return this.session.user.isAdmin;
  }

  get isProvider() {
    // @ts-ignore
    return this.session.user.isProvider;
  }

  get isEmployee() {
    return !this.isAdmin && !this.isProvider;
  }

  ngOnInit(): void {
  }

}
