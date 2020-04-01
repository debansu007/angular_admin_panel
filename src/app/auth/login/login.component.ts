import { Component } from '@angular/core';
import { NbLoginComponent, NbAuthResult } from '@nebular/auth';
import { AuthhenticationService } from '../../services/authhentication.service';
import { DatabaseService } from '../../services/database.service';
import { DataServiceService } from '../../services/data-service.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styles: ['.txtDanger { color: red; } .logo-img { width: 120px; height: 120px; border-radius: 50%;} .logo-wrap { text-align: center;} /deep/ .nb-theme-default nb-card-header .navigation .link nb-icon { display: none !important; }']
})
// export class LoginComponent extends NbLoginComponent {
export class LoginComponent {

  user: any = {
    email: '',
    pass: '',
  };
  loading: boolean = false;

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    private authServ: AuthhenticationService,
    private router: Router,
    private toastrService: NbToastrService,
    public afAuth: AngularFireAuth,
    public databaseServ: DatabaseService,
    public dataServ: DataServiceService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.router.navigate(['pages/dashboard']);
      }
    });
  }

  // login(): void {

  //   this.errors = [];
  //   this.messages = [];
  //   this.submitted = true;

  //   this.service.authenticate(this.strategy, this.user).subscribe((result: any) => {
  //     this.submitted = false;

  //     // console.log(result.response);
  //     if (result.response.body.status === 'USER_NOT_EXIST') {
  //       this.errors = ['User not exist! please register first'];
  //     } else if (result.response.body.status === 'WRONG_CREDENTIALS') {
  //       this.errors = ['Incorrect login credentials'];
  //     } else {
  //       this.messages = result.getMessages();
  //     }

  //     // if (result.isSuccess()) {
  //     //   this.messages = result.getMessages();
  //     // } else {
  //     //   this.errors = result.getErrors();
  //     // }

  //     const redirect = result.getRedirect();
  //     if (redirect) {
  //       setTimeout(() => {
  //         return this.router.navigateByUrl(redirect);
  //       }, this.redirectDelay);
  //     }
  //     this.cd.detectChanges();
  //   });
  // }

  /**
   * @function{{myLogin}}
   * @description{{Login method}}
   */
  myLogin() {
    if (this.user.email == environment.adminEmail) {
      // console.log(this.user);
      this.loading = true;
      this.authServ.adminLogin(this.user.email, this.user.pass)
      .then(
        (user: any) => {
          this.loading = false;
          this.authServ.authState = user;
          // this.dataServ.change({ userType: 'admin' });
          // let localObj = {
          //   email: this.authServ.authState.user.email,
          //   uid: this.authServ.authState.user.uid
          // };
          // console.log(localObj);
          // localStorage.setItem('adminLogger', JSON.stringify(localObj));
          console.log(this.authServ.authState);
          this.router.navigate(['pages/dashboard']);
        }
      )
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.toastrService.danger('Email/password is incorrect.', 'Error!');
      });
    }
    else {
      // this.toastrService.danger('Admin email not matching.', 'Error!');
      this.loginNew();
    }
  }

  loginNew() {
    this.loading = true;
    this.authServ.adminLogin(this.user.email, this.user.pass)
    .then(
      (user: any) => {
        this.loading = false;
        this.checkUser(user);
      }
    )
    .catch(
      (error) => {
        this.loading = false;
        console.log(error);
        this.toastrService.danger('Email/password is incorrect.', 'Error!');
      }
    );
  }

  checkUser(data) {
    this.databaseServ.getUserOrganizationById(data.user.uid)
    .subscribe(
      (org: any) => {
        console.log('check',org);
        if(org.length>0) {
          // this.dataServ.change({ userType: 'organization' });
          this.authServ.authState = data;
          console.log(this.authServ.authState);
          this.router.navigate(['pages/report']);
        }
        else {
          this.toastrService.danger('User do not have any organizations.', 'Error!');
          this.authServ.logout();
          // this.router.navigate(['auth/login']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}