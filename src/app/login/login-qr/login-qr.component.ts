import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { first } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import {AlertSimpleComponent} from '../../common/forms/common-forms/alert-simple/alert-simple.component';

@Component({
  selector: 'app-login-qr',
  templateUrl: './login-qr.component.html',
  styleUrls: ['./login-qr.component.less']
})
export class LoginQrComponent extends LoginComponent implements OnInit {

  loginForm: FormGroup;

  /**
   * Method that starts the form and sets the validators.
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [''],
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  /**
   * Method that submits the information from the AuthenticationService.
   */
  onSubmit() {
    this.submitted = true;
    this.loading = true;

    /**
     * Login from the AuthenticationService based on input. If the login was fine, redirect to the returnUrl. If there's an error store it,
     * and return it.
     */
    this.authenticationService.loginQR(this.form.usernameID.value).pipe(first())
      .subscribe(() => {
        this.router.navigate([this.returnUrl]);
      }, () => {
        this.loading = false;

        const errorOnLogin = this.modalService.open(AlertSimpleComponent, { size: 'lg' });
        errorOnLogin.componentInstance.content = {
          title: '¡Hubo un error!',
          description:
            `<i>¿Existe el usuario?<br>¿El código QR está correcto?<br>¿Está sucio o roto el carnet donde está el código?</i>
<br><br>Intenta de nuevo o habla con tu administrador.`,
          cancelText: '',
          confirmationText: 'OK'
        };
      });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
