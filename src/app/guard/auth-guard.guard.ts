import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthhenticationService } from '../services/authhentication.service';
import { take, map } from 'rxjs/operators';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthhenticationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    // if (!this.authService.authState) {
    if (!localStorage.getItem('adminLogger')) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return true;

    // if (this.authService.authenticated) { return true; }

    // return this.authService.currentUserObservable
    // .pipe(
    //   take(1)
    // ).map(user => !!user)
    //   .do(loggedIn => {
    //     if (!loggedIn) {
    //       console.log("access denied")
    //       this.router.navigate(['auth/login']);
    //     }
    //   })

  }
}