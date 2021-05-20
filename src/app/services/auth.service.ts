/* eslint-disable no-underscore-dangle */
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Constant } from '../constants/constant';
import { AuthModel, LoginResponse } from '../models/auth.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  authDetails = new BehaviorSubject<AuthModel>(null);
  private activeLogoutTimer: any;

  constructor(
    public afAuth: AngularFireAuth,
    private _router: Router,
    public storage: Storage
  ) {
    this.storage.create();
  }

  // Sign in with Google
  googleAuth() {
    return this.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  async signInWithPopup(provider) {
    await this.afAuth.signOut();
    const signInResult = await this.afAuth.signInWithPopup(provider);

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 10);
    const loginResp = new LoginResponse();
    /* tslint:disable:no-string-literal */
    // eslint-disable-next-line @typescript-eslint/dot-notation
    loginResp.idToken = signInResult.user['za'];
    loginResp.userId = signInResult.user.email;
    loginResp.expiresIn = expireDate.toDateString();
    loginResp.role = 'ADMIN';
    await this.setAuthData(loginResp);

    return signInResult;
  }

  get userIsAuthenticated() {
    this.autoLogin().subscribe();
    return this.authDetails.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userRole(): Observable<string> {
    return this.authDetails.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.role;
        } else {
          return null;
        }
      })
    );
  }

  get userName(): Observable<string> {
    return this.authDetails.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.userName;
        } else {
          return null;
        }
      })
    );
  }

  get token(): Observable<string> {
    return this.authDetails.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  autoLogin(): Observable<boolean> {
    return from(this.storage.get(Constant.AUTH_DATA_STORAGE))
      .pipe(
        map((storedData: any) => {
          if (!storedData) {
            return null;
          }
          const parsedData = JSON.parse(storedData) as {
            _token: string;
            tokenExpirationDate: string;
            userName: string;
            role: string;
          };
          const expirationTime = new Date(parsedData.tokenExpirationDate);
          if (expirationTime <= new Date()) {
            return null;
          }
          const authDetails = new AuthModel(
            parsedData.userName,
            parsedData._token,
            expirationTime,
            parsedData.role
          );
          return authDetails;
        }),
        tap((authDetails) => {
          if (authDetails) {
            this.authDetails.next(authDetails);
            this.autoLogout(authDetails.tokenDuration);
          }
        }),
        map((authDetails) => !!authDetails)
      );

  }


  // loginService(loginForm: LoginModel): Promise<LoginResponse> {
  //   return this._http
  //     .post<LoginResponse>(this.LOGIN_URL, {
  //       phoneNumber: loginForm.userName,
  //       password: loginForm.password,
  //     })
  //     .pipe(tap(this.setAuthData.bind(this))).toPromise();
  // }


  // async loginService(loginForm: LoginModel): Promise<any> {

  //   const expireDate = new Date();
  //   expireDate.setDate(expireDate.getDate() + 10);
  //   const loginResp = new LoginResponse();
  //   /* tslint:disable:no-string-literal */
  //   loginResp.idToken = response.user['ya'];
  //   loginResp.userId = response.user.email;
  //   loginResp.expiresIn = expireDate.toDateString();
  //   loginResp.role = 'ADMIN';
  //   await this.setAuthData(loginResp);

  //   return loginResp;

  // }

  async logOutService() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    await this.signOut();
    await this.authDetails.next(null);
    this.storage.remove(Constant.AUTH_DATA_STORAGE);
    // this.storage.set(AppConstants.HAS_LOGGED_IN, false);

    this._router.navigateByUrl(Constant.HOME);
  }


  private async signOut() {
    this.afAuth.signOut()
      .then(res => {
        console.log(res);
      }).catch(error => {
        console.log(error);
      });
  }

  private setAuthData(loginResponse: LoginResponse) {
    const authData = new AuthModel(
      loginResponse.userId,
      loginResponse.idToken,
      new Date(loginResponse.expiresIn),
      loginResponse.role
    );
    this.authDetails.next(authData);
    this.storeAuthData(authData);

  }


  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logOutService();
    }, duration);
  }

  private storeAuthData(authData: AuthModel) {
    this.storage.set(Constant.AUTH_DATA_STORAGE, JSON.stringify(authData));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
