import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'ngx-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

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
        title: 'Website',
      },
      verifyStatus: {
        title: 'Status',
        editable: false,
        filter: false,
      },
      // sendPush: {
      //   title: 'View Reports',
      //   editable: false,
      //   filter: false,
      //   type: 'html',
      //   valuePrepareFunction: (btn) => { return this._sanitizer.bypassSecurityTrustHtml(`<button nbButton>View Reports</button>`) }
      // }
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
    public _sanitizer: DomSanitizer,
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
    this.getOrganizations();
  }

  /**
   * @function{{getOrganizations}}
   * @description{{get organization data}}
   */
  getOrganizations() {
    this.databaseServ.getAllOrganization().pipe(
      take(1)
    )
    .subscribe(
      (comp: any) => {
        console.log(comp);
        comp.forEach((el: any, i) => {
          comp[i] = { ...comp[i], verifyStatus: el.userid ? 'Verified' : 'Unverified' }
        });
        this.data = comp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{onEditConfirm}}
   * @description{{on edit confirm function}}
   */
  onEditConfirm(event): void  {
    console.log('foo', event);
    this.updateComp(event);
    // event.confirm.resolve();
    // event.confirm.reject();
  }

  /**
   * @function{{updateComp}}
   * @description{{update company method}}
   */
  updateComp(event) {
    delete(event.newData.verifyStatus);
    this.databaseServ.updateCompany(event.newData)
    .then(
      (res) => {
        // console.log('res',res);
        event.confirm.resolve();
      }
    ).catch(
      (err) => {
        console.log(err);
        event.confirm.reject();
      }
    );
  }

  /**
   * @function{{onRowSelect}}
   * @description{{on rowS slect method}}
   */
  onRowSelect(event): void {
    console.log(event);
    this.router.navigate(['pages/report'], {queryParams: { companyId: event.data.id}});
  }

}
