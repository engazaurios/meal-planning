import { Component, OnInit, HostListener } from '@angular/core';
import { LoginComponent } from '../login/login.component';

export enum KEY_CODE {
  ENTER = 13,
}

@Component({
  selector: 'app-login-qr',
  templateUrl: './login-qr.component.html',
  styleUrls: ['./login-qr.component.less']
})
export class LoginQrComponent extends LoginComponent implements OnInit {
  qrCode: String;
  statusClass: String;
  statusMessage: String;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.loginWithQRCode(this.qrCode);
      this.qrCode = '';
    } else {
      this.qrCode = this.qrCode +  event.key;
    }
  }

  /**
   * Method that starts the form and sets the validators.
   */
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.qrCode = '';
    this.statusClass = '';
    this.statusMessage = 'Acerca tu carnet al lector';
  }

  /**
   * Method that submits the information from the AuthenticationService.
   */
  loginWithQRCode(token: String) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.statusMessage = 'Cargando...';

    /**
     * Login from the AuthenticationService based on input. If the login was fine, redirect to the returnUrl. If there's an error store it,
     * and return it.
     */
    this.authenticationService.loginQR(token)
      .subscribe(res => {
        this.router.navigate([this.returnUrl]);
      }, (err) => {
        if (err.status === 401) {
          this.showMessage("Usuario invalido", 'error');
        } else {
          this.showMessage("Ocurrio un error", 'error');
        }
      });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  showMessage(statusMessage: String, statusClass: String) {
    this.statusMessage = statusMessage;
    this.statusClass = statusClass;
    setTimeout(() => {
      this.statusClass = '';
      this.statusMessage = 'Acerca tu carnet al lector';
      this.loading = false;
    }, 2500);
  }
}
