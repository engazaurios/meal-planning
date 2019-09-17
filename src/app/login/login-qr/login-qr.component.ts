import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { first } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

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
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
