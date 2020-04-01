import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthhenticationService {

  authenticationState = new BehaviorSubject(false);
  authUser = new BehaviorSubject(null);
  authState: any = null;
  isLoggedIn = false;
  user: any;
  redirectUrl: string;

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public router: Router,
    public dataServ: DataServiceService
  ) {
    this.afAuth.authState.subscribe(auth => {
      this.authState = auth;
      this.authUser.next(this.authState);
      this.authenticationState.next(true);
      // if (!auth) {
      //   this.router.navigate(['auth/login']);
      // }
      // if (auth) {
      //   this.user = auth;
      //   this.isLoggedIn = true;
      //   if (this.redirectUrl) {
      //     this.router.navigate([this.redirectUrl]);
      //   } else {
      //     this.router.navigate(['pages/dashboard']);
      //   }
      // }
    }, err => {
      console.log('afAuth authState Error : ', err);
    });
  }

  /**
   * @function{{adminLogin}} 
   * @description{{admin login}}
   */
  adminLogin(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * @function{{logout}}
   * @description{{logout}}
   */
  logout() {
    this.isLoggedIn = false;
    this.dataServ.changeData(null);
    // localStorage.removeItem('adminLogger');
    this.authenticationState.next(false);
    return this.afAuth.auth.signOut();
  }

  /**
   * @function{{updatePassword}}
   * @description{{update password method}}
   */
  updatePassword(email: string, newPassword: string, oldPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const user = this.afAuth.auth.currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(email, oldPassword);
      user.reauthenticateAndRetrieveDataWithCredential(credentials)
        .then(
          (succ) => {
            user.updatePassword(newPassword).then(
              res => {
                resolve({ status: 1 });
              },
              err => {
                resolve({ status: 0, error: err });
              }
            );
          },
          err => {
            resolve({ status: 0, error: err });
          }
        );
    });
  }

}
