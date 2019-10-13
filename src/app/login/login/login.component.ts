import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../_services';
import {first} from 'rxjs/operators';
import {AlertSimpleComponent} from '../../common/forms/common-forms/alert-simple/alert-simple.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

/**
 * Component class that will handle the login form and interaction with user.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loading = false;
  submitted = false;

  returnUrl: string;
  error: string;

  constructor(
    protected formBuilder: FormBuilder,
    protected route: ActivatedRoute, protected router: Router,
    protected authenticationService: AuthenticationService,
    protected modalService: NgbModal
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Method that starts the form and sets the validators.
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

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
    /**
     * Login from the AuthenticationService based on input. If the login was fine, redirect to the returnUrl. If there's an error store it,
     * and return it.
     */
    this.authenticationService.login(this.form.username.value, this.form.password.value).pipe(first())
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      }, () => {
        this.loading = false;

        const errorOnLogin = this.modalService.open(AlertSimpleComponent, { size: 'lg' });
        errorOnLogin.componentInstance.content = {
          title: '¡Hubo un error!',
          description:
            `<i>¿Existe el usuario?<br>¿La contraseña está correcta?<br>¿Problema de conexión?</i>
<br><br>Intenta de nuevo o habla con tu administrador.`,
          cancelText: '',
          confirmationText: 'OK'
        };
      });
  }

  loginWithQrCode() {
    this.router.navigate(['/login-qr']);
  }

  attendance() {
    this.router.navigate(['/attendance']);
  }
}
