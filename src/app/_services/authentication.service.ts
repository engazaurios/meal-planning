import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/***
 * Class that handles the login/logout from users based on the API request/response.
 */

@Injectable({ providedIn : 'root'})
export class AuthenticationService {

  // Key of the local storage.
  public currentUserKey: 'currentUser';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  // Gets the user from the local storage and notify to others.
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(this.currentUserKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Returns tue current user.
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Logs in to the API by sending as a JSON the user information.
  login(username, password) {
    return this.http.post<any>(`https://localhost:4201`, {username, password})
      .pipe(map(user => {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  // Logs out by removing from the local storage the value and set the global variable as null.
  logout() {
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
  }

}
