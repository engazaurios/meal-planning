import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../_services';
import {Observable} from 'rxjs';

/**
 * Injectable typescript that handles the responses/requests from the API server.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Method that intercepts the request and sends the authentication token.
   * @param req HttpRequest to intercept.
   * @param next HttpHandler to send the authentication token.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    return next.handle(req);
  }

}
