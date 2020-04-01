import { Component, OnInit } from '@angular/core';
import { AuthhenticationService } from '../../services/authhentication.service';
import { DataServiceService } from '../../services/data-service.service';
import { NbToastrService } from '@nebular/theme';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  canDisplay: boolean = false;
  oldpass: string = '';
  newpass: string = '';
  cnfpass: string = '';
  loading: boolean = false;

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public authServ: AuthhenticationService,
    public toastrService: NbToastrService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public dataServ: DataServiceService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.canDisplay = false;
        this.router.navigate(['auth/login']);
      }
      else {
        this.canDisplay = true;
        this.dataServ.userSource.subscribe(
          (res: any) => {
            console.log('user page',res);
            if(res) {
              if(res.userType != 'admin') {
                this.router.navigate(['pages/report']);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  /**
   * @function{{ngOnInit}}
   * @description{{Lifecycle hook}}
   */
  ngOnInit() {
  }

  /**
   * @function{{changePassword}}
   * @description{{change password method}}
   */
  changePassword() {
    this.loading = true;
    this.authServ.updatePassword(this.authServ.authState.email, this.newpass, this.oldpass)
    .then(
      (res: any) => {
        this.loading = false;
        console.log(res);
        if(res.status == 1) {
          this.toastrService.success('Password changed successfully', 'Success!');
        }
        if(res.status == 0 && res.error.code == 'auth/wrong-password') {
          this.toastrService.danger('Old password is not correct', 'Error!');
        }
        else {
          this.toastrService.danger('Something went wrong', 'Error!');
        }
      }
    ).catch(
      err => {
        this.loading = false;
        console.log(err);
        this.toastrService.danger('Something went wrong', 'Error!');
      }
    );
  }

}
