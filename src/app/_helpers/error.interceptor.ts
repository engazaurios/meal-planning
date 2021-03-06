import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../_services';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {LoaderService} from '../common/loader/loader.service';

/**
 * Injectable typescript that handles the error messages.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private loaderService: LoaderService) {
  }

  /**
   * Method that intercepts the error request and display it in the page.
   * @param req HttpRequest to intercept.
   * @param next HttpHandler to send the authentication token.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {
      if (err.status === 400) {
        this.authenticationService.logout();
        location.reload();
      }

      this.loaderService.show();

      const error = err.error.message || err.statusText;
      return throwError(error).pipe(
        finalize(() => this.loaderService.hide())
      );
    }));
  }

}
