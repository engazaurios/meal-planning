import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';

// https://angular.io/docs
// https://jasonwatmore.com/post/2019/05/17/angular-7-tutorial-part-4-login-form-authentication-service-route-guard
/**
 * Component class that will handle the login form and interaction with user.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  // Login form with username/password inputs.
  loginForm: FormGroup;

  // Flags to determine if page is loading or is already submitted.
  loading = false;
  submitted = false;

  // Return url when the user logs in.
  returnUrl: string;
  // Saves the error if there's any.
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // If authentication service has already a value, then go to Home Page.
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Method that starts the form and sets the validators.
   */
  ngOnInit() {
    // Creates the login form from Username and Password in blank.
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters.
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  /**
   * Form variable.
   */
  get form() {
    return this.loginForm.controls;
  }

  /**
   * Method that submits the information from the AuthenticationService.
   */
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Login from the AuthenticationService based on input. If the login was fine, redirect to the returnUrl. If there's an error store it,
    // and return it.
    this.authenticationService.login(this.form.username.value, this.form.password.value)
      .pipe(first())
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }

}
