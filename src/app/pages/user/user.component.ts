import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { DataServiceService } from '../../services/data-service.service';
import { take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  canDisplay: boolean = false;
  settings = {
    actions: {
      add: false,
      edit: true,
      delete: false,
      position: 'left',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
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
      }
    }
  };

  data: any = [];

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public databaseServ: DatabaseService,
    private _sanitizer: DomSanitizer,
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
        this.data = users;
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * @function{{onEditConfirm}}
   * @description{{on edit confirm method}}
   */
  onEditConfirm(event): void {
    console.log('foo', event);
    this.updateUser(event);
    // event.confirm.resolve();
    // event.confirm.reject();
  }

  /**
   * @function{{updateUser}}
   * @description{{update user data method}}
   */
  updateUser(event) {
    delete(event.newData.userType);
    this.databaseServ.updateUser(event.newData)
      .then(
        (res) => {
          // console.log('res',res);
          event.confirm.resolve();
        }
      ).catch(
        err => {
          console.log(err);
          event.confirm.reject();
        }
      );
  }

}
