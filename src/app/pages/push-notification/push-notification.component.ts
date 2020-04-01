import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { DataServiceService } from '../../services/data-service.service';
import { take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import Swal from 'sweetalert2';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  canDisplay: boolean = false;
  users: any = [];
  selected: any = [];
  settings = {
    selectMode: 'multi',
    mode: 'external',
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'left',
    },
    columns: {
      name: {
        title: 'Name',
      },
      email: {
        title: 'Email',
        editable: false,
      },
      phone: {
        title: 'Phone'
      },
      image: {
        title: 'Image',
        type: 'html',
        valuePrepareFunction: (image) => { return this._sanitizer.bypassSecurityTrustHtml(`<img style="width: 150px; height: 100px;" src='${image ? image : '/assets/images/no_img_available.jpg'}' />`); },
        filter: false,
        editable: false,
      },
      websiteUrl: {
        title: 'Website'
      },
      userType: {
        title: 'User Type',
        editable: false,
        filter: false,
      },
      // sendPush: {
      //   title: 'Send Push',
      //   editable: false,
      //   filter: false,
      //   type: 'html',
      //   valuePrepareFunction: (btn) => { return this._sanitizer.bypassSecurityTrustHtml(`<button nbButton>Send</button>`) }
      // }
    }
  };
  titleModel: string = '';
  bodyModel: string = '';

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public databaseServ: DatabaseService,
    public _sanitizer: DomSanitizer,
    private toastrService: NbToastrService,
    private dataServ: DataServiceService
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
    this.getUsers();
  }

  /**
   * @function{{getUsers}}
   * @description{{get all users method}}
   */
  getUsers() {
    this.databaseServ.getAllUsers().pipe(
      take(1)
    )
    .subscribe(
      (users: any) => {
        console.log(users);
        users.forEach((el: any, i) => {
          users[i] = { ...users[i], userType: el.isIndividual ? 'Individual' : 'Organization' }
        });
        this.users = users;
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * @function{{userSelectRows}}
   * @description{{user select rows}}
   */
  userSelectRows(selectedList) {
    console.log(selectedList);
    this.selected = selectedList;
  }

  /**
   * @function{{send}}
   * @description{{send push initiative}}
   */
  send() {
    if(this.selected.length>0) {
      this.showPopup();
    }
    else {
      this.toastrService.warning('Please select one user.', 'Warning!');
    }
  }

  showPopup() {
    let str = ``;
    this.selected.forEach((element: any, i) => {
      if(element.name) {
        str = (i != 0) ? `${element.name}, ${str}` : `${element.name} ${str}`;
      }
    });
    str = `Send push to ${str}`;
    Swal.fire({
      title: 'Are you sure?',
      text: str,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3366ff',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, send!'
    }).then((result) => {
      if (result.value) {
        // console.log('do stuffs');
        this.sendPush();
      }
      else {
        // console.log('nothing happens');
      }
    })
  }

  sendPush() {
    let tokenArr = [];
    this.selected.forEach((element: any, i) => {
      if(element.devicetoken) {
        tokenArr.push(element.devicetoken);
      }
    });
    this.databaseServ.sendPushNotification(this.titleModel, this.bodyModel, tokenArr)
    .subscribe(
      (res: any) => {
        this.storeNotification();
        console.log(res);
        Swal.fire(
          'Sent!',
          'Push notification has been sent.',
          'success'
        );
      },
      (err: any) => {
        console.log(err);
        // this.toastrService.danger('Something went wrong','Error');
      }
    );
  }

  storeNotification() {
    this.selected.forEach(element => {
      let notiObj = {
        id: '',
        reportId: '',
        orgID: '',
        orgUserid: element.id,
        notificationTitle: this.titleModel,
        notificationBody: this.bodyModel,
        notificationType: 'Admin'
      };
      console.log(notiObj);
      this.databaseServ.stroreNoti(notiObj)
      .then(
        (res: any) => {
          console.log('success');
        }
      ).catch(
        (err) =>{
          console.log(err);
        }
      );
    });
  }

}
