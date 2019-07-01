import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RequestService } from './request.service';

/***
 * Typescript that handles the login/logout from users based on the API request/response.
 */
@Injectable({ providedIn : 'root'})
export class AuthenticationService {

  public currentUserKey: 'currentUser';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private request: RequestService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(this.currentUserKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Method that returns the current singleton user.
   */
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  /**
   * Method that logs in to the API by sending as a JSON the user information.
   * @param username Username of the user to log in.
   * @param password Password of the user to log in.
   * TODO: replace localhost url to the API URL.
   * TODO: two diff roles: admin/user.
   */
  login(username: string, password: string) {
    return this.request.post('/AppUsers/login', { username, password })
      .pipe(map(user => {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  /**
   * Method that logs in to the API by sending as a JSON the userID information from the QR.
   * @param usernameID Username of the user to log in.
   * TODO: replace localhost url to the API URL.
   * TODO: two diff roles: admin/user.
   */
  loginQR(usernameID: string) {
    const user = JSON.parse('{"name":"Test", "role":"user", "token": "", "redirectURL":"/"}');

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;

    // TODO: uncomment when API is ready.
    // return this.http.post<any>(`https://localhost:4201`, {usernameID})
    //   .pipe(map(user => {
    //     localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //     return user;
    //   }));
  }

  /**
   * Method that logs out by removing from the local storage the value and set the global variable as null.
   */
  logout() {
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
  }

}
