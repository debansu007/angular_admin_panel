import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DatabaseService } from '../../services/database.service';
import { DataServiceService } from '../../services/data-service.service';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @ViewChild('revdialog', {static: false}) dialog;

  canDisplay: boolean = false;
  notifications: any = [];
  userRes: any = null;
  user: any;
  sltdOrg: any;
  organizations: any = [];
  respBody: string = '';
  respFor: any = {};

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public datebaseServ: DatabaseService,
    public dataServ: DataServiceService,
    public dialogService: NbDialogService,
    private toastrService: NbToastrService,
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
            console.log('noti page',res);
            if(res) {
              this.userRes = res;
              if(this.userRes.userType == 'organization') {
                this.getUserOrganizations();
              }
              if(this.userRes.userType == 'admin') {
                this.getAllNotifications();
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

  ngOnInit() {
  }

  getAllNotifications() {
    this.datebaseServ.getNotifications().subscribe(
      (noti: any) => {
        console.log(noti);
        this.notifications = noti;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getOrganizationNoti() {
    this.datebaseServ.getNotificationsById(this.userRes.userData.uid)
  }

  getUserOrganizations() {
    this.datebaseServ.getUserOrganizationById(this.userRes.userData.uid).subscribe(
      (org: any) => {
        console.log(org);
        // this.user = usr;
        this.sltdOrg = org[0].id;
        this.organizations = org;
        this.getNotificationsOfOrgs();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeOrg(event) {
    console.log('org changed',event);
    this.getNotificationsOfOrgs();
  }

  getNotificationsOfOrgs() {
    this.datebaseServ.getNotificationsByOrgId(this.sltdOrg).subscribe(
      (res: any) => {
        console.log('noti',res);
        this.notifications = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  elipsis(str, noOfLetters) {
    if(str.length <= noOfLetters) {
      return str;
    }
    if(str.length > noOfLetters) {
      return `${str.slice(0,noOfLetters)}...`;
    }
  }

  notiClick(notification) {
    Swal.fire({
      title: 'Do you want to approve this business??',
      text: "This business will be approved to the specified user!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3366ff',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      if (result.value) {
        console.log('val');
        this.doClaim(notification);
      }
      else {
        console.log('reject');
      }
    })
  }

  reviewClick(notification) {
    this.respFor = notification;
    this.datebaseServ.getReviewById(notification.reviewId).subscribe(
      (res: any) => {
        if(res.response) {
          this.respBody = res.response;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.dialogService.open(this.dialog);
  }

  getPadding(notification) {
    if(notification.notificationType == 'claim' || notification.notificationType == 'Review Notification') {
      return '1rem';
    }
    else {
      return '0px';
    }
  }

  respond() {
    let rspObj = {
      id: this.respFor.reviewId,
      response: this.respBody
    }
    this.datebaseServ.storeResponse(rspObj).then(
      (rev: any) => {
        console.log(rev);
        this.toastrService.success('Response updated.', 'Success!');
      }
    ).catch(
      (err) => {
        console.log(err);
        this.toastrService.danger('Something went wrong.', 'Error!');
      }
    );
  }

  doClaim(data) {
    console.log(data);
    this.datebaseServ.getOrganizationById(data.claimedBusiness).pipe(take(1))
    .subscribe(
      (bus: any) => {
        console.log('business',bus);
        let combo = {...data, ...bus};
        this.datebaseServ.insertOrganization(combo)
        .then(
          (res: any) => {
            console.log('done',res);
            this.deleteNoti(data);
          }
        ).catch(
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteNoti(data) {
    this.datebaseServ.deleteNotificationById(data.id)
    .then(
      (res: any) => {
        console.log('deleted',res);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    );
  }

}
