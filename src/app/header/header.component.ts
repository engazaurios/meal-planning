import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { User } from '../users/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  title = 'Planificación de Comidas';

  isHeaderCollapsed = true;
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

  ngOnInit(): void {
  }

}
