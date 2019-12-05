import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../_services';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {LoaderService} from '../common/loader/loader.service';
import {NotifierService} from 'angular-notifier';

/**
 * Injectable typescript that handles the error messages.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private notifier: NotifierService,
              private loaderService: LoaderService) {
  }

  /**
   * Method that intercepts the error request and display it in the page.
   * @param req HttpRequest to intercept.
   * @param next HttpHandler to send the authentication token.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      if (error.status === 400 || error.status === 401) {
        this.authenticationService.logout();
        location.reload();
      }

      this.loaderService.show();

      // this.notifier.hideAll();
      this.notifier.notify('error', 'Hubo un error. Intenta de nuevo.');

      return throwError(error).pipe(
        finalize(() => this.loaderService.hide())
      );
    }));
  }

}
