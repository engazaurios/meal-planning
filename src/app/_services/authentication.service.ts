import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/***
 * Class that handles the login/logout from users.
 */

@Injectable({ providedIn : 'root'})
export class AuthenticationService {

  public currentUserKey: 'currentUser';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient){
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(this.currentUserKey)));
    this.currentUser = this.currentUserSubject.getValue();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    // Set the backend URL as a global config.
    return this.http.post<any>(`https://localhost:4201`, {username, password})
      .pipe(map(user => {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
  }

}
