import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthhenticationService } from '../services/authhentication.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuardGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthhenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    // if (!this.authService.authState) {
    if (!localStorage.getItem('adminLogger')) {
      return true;
    }
    this.router.navigate(['/pages/dashboard']);
    return false;
  }
  
}
