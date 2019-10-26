import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Observable, throwError } from 'rxjs';
import {LoaderService} from '../common/loader/loader.service';
import {finalize, catchError} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';

/**
 * Injectable typescript that handles the responses/requests from the API server.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private notifier: NotifierService,
              private loaderService: LoaderService) {}

  /**
   * Method that intercepts the request and sends the authentication token.
   * @param req HttpRequest to intercept.
   * @param next HttpHandler to send the authentication token.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;

    this.loaderService.show();

    if (currentUser && currentUser.id) {
      req = req.clone({
        setHeaders: {
          Authorization: currentUser.id
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `${error.error.message}`;
        } else {
          errorMessage = `${error.message}`;
        }

        // this.notifier.hideAll();
        this.notifier.notify(
          'error',
          'Hubo un error. Intenta de nuevo.'
        );

        return throwError(errorMessage);
      }),
      finalize(() => this.loaderService.hide())
    );
  }

}
