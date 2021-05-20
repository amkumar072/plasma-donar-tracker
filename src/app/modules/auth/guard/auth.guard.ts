/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Constant } from 'src/app/constants/constant';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router

  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userAuthenticationUtil(route);
  }

  userAuthenticationUtil(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this._authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuth: boolean) => {
        // Check user is already logged in
        if (!isAuth) {
          // call auto login
          return this._authService.autoLogin();
        }
        else {
          return of(isAuth);
        }
      }),
      map((isAuth) => {
        if (!isAuth) {
          // If user is not authenticated logout
          this._router.navigateByUrl(Constant.AUTH);
        }
        else {
          this.userAuthorizationUtil(route.data.roles).subscribe(result => {
            isAuth = result;
            if (!result) {
              // If user is not authorized redirect to home page
              // this._router.navigateByUrl('/');
            }
          });
        }
        return isAuth;
      })
    );
  }

  userAuthorizationUtil(rolesList): Observable<boolean> {
    return this._authService.userRole.pipe(
      take(1),
      map(role => {
        // console.log(role);
        if (role === undefined) {
          // console.log('Role is not defined');
          this._router.navigateByUrl(Constant.AUTH);
        }
        else if (role && rolesList && !rolesList.includes(role)) { // check if route is restricted by role
          // role not authorised so redirect to home page
          // console.log('User is not authenticated to view this');
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
