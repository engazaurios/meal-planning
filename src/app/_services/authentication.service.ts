import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestService } from './request.service';
import { DataHelperService } from './data.helper.service';

interface LoginResponse {
  id: string,
  ttl: number,
  user: Object,
  userId: string
};

/***
 * Typescript that handles the login/logout from users based on the API request/response.
 */
@Injectable({ providedIn : 'root'})
export class AuthenticationService {
  public sessionKey = 'session';
  private sessionSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private request: RequestService, private dataHelper: DataHelperService) {
    let session = JSON.parse(localStorage.getItem(this.sessionKey));

    if (session) {
      session.user = this.dataHelper.createUserFromObject(session.user);
    }

    this.sessionSubject = new BehaviorSubject<any>(session);
    this.currentUser = this.sessionSubject.asObservable();
  }

  /**
   * Method that returns the current singleton user.
   */
  public get currentUserValue() {
    return this.sessionSubject.value;
  }

  /**
   * Method that logs in to the API by sending as a JSON the user information.
   * @param username Username of the user to log in.
   * @param password Password of the user to log in.
   * TODO: replace localhost url to the API URL.
   * TODO: two diff roles: admin/user.
   */
  login(username: string, password: string) {
    return this.request
      .post(
        '/AppUsers/login',
        { username, password },
        {
          params: { include: 'user' }
        }
      )
      .pipe(map((session: LoginResponse) => {
        session.user = this.dataHelper.createUserFromObject(session.user);

        localStorage.setItem(this.sessionKey, JSON.stringify(session));

        this.sessionSubject.next(session);

        return session;
      }));
  }

  /**
   * Method that logs in to the API by sending as a JSON the userID information from the QR.
   * @param usernameID Username of the user to log in.
   * TODO: replace localhost url to the API URL.
   * TODO: two diff roles: admin/user.
   */
  loginQR(usernameID: string) {
    // TODO: Implement
    return this.login('todo', 'todo');
  }

  /**
   * Method that logs out by removing from the local storage the value and set the global variable as null.
   */
  logout() {
    localStorage.removeItem(this.sessionKey);

    this.sessionSubject.next(null);
  }

}
