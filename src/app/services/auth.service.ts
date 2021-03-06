import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestMethod, Headers, Request } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';
import { State } from '../state/main.state';

import { login, logout } from '../actions/auth.actions';
interface UserInfo {
    id: Number;
    fakeToken: String;
    name: {
      first: String;
      last: String
    };
    username: String;
    password: String;
}

@Injectable()
export class AuthService {
  public static handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || { error: '' };
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  public loggedIn: boolean;
  private userToken: string;
  private userInfo: UserInfo;

  private baseUrl: string;

  constructor(
    private http: Http,
    public store: Store<State>
    ) {
    this.baseUrl = 'http://localhost:3004';

    this.userToken = localStorage.getItem('userToken');
    if (this.userToken) {
      this.getUserInfo(this.userToken).subscribe({
        next: (userInfo) => this.userInfo = userInfo,
        complete: () => {
          this.store.dispatch(login(this.userInfo.username));
        }
      });
    }

    this.store.select('combinedReducer', 'authStoreReducer')
      .subscribe((state: State) => {
         this.loggedIn = state.isLoggedIn;
      });
  }

  public login (username: String, password: String): Observable<string> {
    let requestOptions = new RequestOptions();
    let request: Request;
    requestOptions.url = `${this.baseUrl}/auth/login`;
    requestOptions.method = RequestMethod.Post;
    requestOptions.body = {
      username,
      password
    };
    request = new Request(requestOptions);
    return this.http.request(request)
                    .map((res) => res.json().token)
                    .catch(AuthService.handleError);
  }

  public logout(): void {
      this.store.dispatch(logout());
      localStorage.removeItem('userToken');
  };

  public isAuthenticated(): boolean {
    return this.loggedIn;
  };

  public getUserInfo(token: string): Observable<UserInfo> {
    let requestOptions = new RequestOptions();
    let request: Request;
    let headers = new Headers();
    requestOptions.url = `${this.baseUrl}/auth/userinfo`;
    requestOptions.method = RequestMethod.Post;
    headers.append('Authorization', token);
    requestOptions.headers = headers;

    request = new Request(requestOptions);
    return this.http.request(request)
                    .map((res) => res.json())
                    .catch(AuthService.handleError);
  }
}
