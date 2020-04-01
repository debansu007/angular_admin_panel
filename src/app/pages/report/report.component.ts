import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { take } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { NbToastrService } from '@nebular/theme';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @ViewChild('dialog', {static: false}) dialog;

  canDisplay: boolean = false;
  settings = {
    actions: {
      add: false,
      edit: true,
      delete: true,
      position: 'left',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      description: {
        title: 'Description',
      },
      impact: {
        title: 'Impact',
      },
      // offense_code: {
      //   title: 'Offense',
      //   editable: false,
      //   valuePrepareFunction: (offense_code) =>{ return offense_code.name },
      // },
      offense_show: {
        title: 'Offense',
        editable: false,
      },
      incidentDateTime: {
        title: 'Incident Date-time',
        editable: false,
      },
      hr_report: {
        title: 'HR Report',
        editable: false,
        filter: false
      },
      protected_status: {
        title: 'Protected Status'
      },
      notes: {
        title: 'Notes',
      },
      read_status: {
        title: 'Read Status',
        editable: false,
        filter: false,
      },
      resolved_status: {
        title: 'Resolved Status',
        editable: false,
        filter: false,
      },
      sendPush: {
        title: 'Send Push',
        editable: false,
        filter: false,
        type: 'html',
        valuePrepareFunction: (btn) => { return this._sanitizer.bypassSecurityTrustHtml(`<button class="pushBtn" nbButton>Send Push</button>`) }
      },
      updatedAt: {
        title: 'Last Edited',
        editable: false,
        filter: false
      },
    }
  };
  compId: string = '';
  data: any = [];
  rowData: any = null;
  titleModel: string = '';
  bodyModel: string = '';
  userData: any = null;
  servData: any = null;
  orgData: any = null;
  sltdOrg: string = '';
  organizations: any = [];

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public databaseServ: DatabaseService,
    public dialogService: NbDialogService,
    public route: ActivatedRoute,
    public _sanitizer: DomSanitizer,
    public toastrService: NbToastrService,
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
            console.log('report page',res);
            if(res) {
              this.servData = res;
              if(res) {
                if(res.userType != 'admin') {
                  this.getUserOrganizations();
                }
                else {
                  this.getCompanyId();
                } 
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

  getUserOrganizations() {
    this.databaseServ.getUserOrganizationById(this.servData.userData.uid).subscribe(
      (org: any) => {
        console.log(org);
        this.sltdOrg = org[0].id;
        this.organizations = org;
        this.getUserReports();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeOrg(event) {
    // console.log('org changed',event);
    this.getUserReports();
  }

  getUserReports() {
    this.databaseServ.getReportsOfOrg(this.sltdOrg).pipe(
      take(1)
    ).subscribe(
      (res: any) => {
        console.log(res);
        res.forEach((element: any, i) => {
          res[i] = { ...res[i], offense_show: element.offense_code.name, hr_report: (element.hrReport * 1 == 1) ? 'Yes' : 'No', read_status: (element.read.toString() == 'true') ? 'Read' : 'Unread', resolved_status: (element.resolved.toString == 'true') ? 'Resolved' : 'Unsolved' };
          res[i] = {...res[i], updatedAt: (element.updatedAt) ? moment(element.updatedAt).format('MM/DD/YYYY HH:mm') : moment(element.createdAt).format('MM/DD/YYYY HH:mm')};
        });
        this.data = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{ngOnInit}}
   * @description{{Lifecycle hook}}
   */
  ngOnInit() {
  }

  /**
   * @function{{getCompanyId}}
   * @description{{get company id from query params}}
   */
  getCompanyId() {
    this.route.queryParams
    .subscribe(
      (params: any) => {
        console.log(params);
        if (params.companyId) {
          this.compId = params.companyId;
          this.getOrgReports(params.companyId);
        }
        else {
          this.compId = '';
          this.getReports();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{getOrgReports}}
   * @description{{get company reports}}
   */
  getOrgReports(compId) {
    this.databaseServ.getReportsOfOrg(compId).pipe(
      take(1)
    )
    .subscribe(
      (res: any) => {
        console.log(res);
        res.forEach((element: any, i) => {
          // if(element.offense_code.name && element.hr_report) {
            res[i] = { ...res[i], offense_show: element.offense_code.name, hr_report: (element.hrReport * 1 == 1) ? 'Yes' : 'No', read_status: (element.read.toString() == 'true') ? 'Read' : 'Unread', resolved_status: (element.resolved.toString == 'true') ? 'Resolved' : 'Unsolved' };
            res[i] = {...res[i], updatedAt: (element.updatedAt) ? moment(element.updatedAt).format('MM/DD/YYYY HH:mm') : moment(element.createdAt).format('MM/DD/YYYY HH:mm')};
          // }
        });
        this.data = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{getReports}}
   * @description{{get all reports data}}
   */
  getReports() {
    this.databaseServ.getAllReports().pipe(
      take(1)
    )
    .subscribe(
      (report: any) => {
        console.log(report);
        report.forEach((element: any, i) => {
          // if(element.offense_code.name && element.hr_report) {
          report[i] = { ...report[i], offense_show: element.offense_code.name, hr_report: (element.hrReport * 1 == 1) ? 'Yes' : 'No', read_status: (element.read.toString() == 'true') ? 'Read' : 'Unread', resolved_status: (element.resolved.toString == 'true') ? 'Resolved' : 'Unsolved' };
          report[i] = {...report[i], updatedAt: (element.updatedAt) ? moment(element.updatedAt).format('MM/DD/YYYY HH:mm') : moment(element.createdAt).format('MM/DD/YYYY HH:mm')};
          // }
        });
        this.data = report;
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{onEditConfirm}}
   * @description{{on edit confirm click method}}
   */
  onEditConfirm(event): void {
    console.log('foo', event);
    this.updateReport(event);
    // event.confirm.resolve();
    // event.confirm.reject();
  }


  /**
   * @function{{updateReport}}
   * @description{{update report data method}}
   */
  updateReport(event) {
    delete(event.newData.offense_show);
    delete(event.newData.hr_report);
    delete(event.newData.read_status);
    delete(event.newData.resolved_status);
    event.newData = {...event.newData, updatedAt: +new Date()};
    this.databaseServ.updateReport(event.newData)
    .then(
      (res: any) => {
        event.confirm.resolve();
        this.getCompanyId();
      }
    ).catch(
      err => {
        console.log(err);
        event.confirm.reject();
      }
    );
  }

  /**
   * @function{{onDeleteConfirm}}
   * @description{{on delete confirm method}}
   */
  onDeleteConfirm(event) {
    // console.log(event);
    // if (window.confirm('Are you sure you want to delete?')) {
    //   event.confirm.resolve();
    // } else {
    //   event.confirm.reject();
    // }
    this.openSwal(event);
  }

  /**
   * @function{{deleteReport}}
   * @description{{delete report method}}
   */
  deleteReport(event) {
    this.databaseServ.deleteReport(event.data)
      .then(
        (del: any) => {
          Swal.fire(
            'Deleted!',
            'Report has been deleted.',
            'success'
          );
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
   * @function{{openSwal}}
   * @description{{open swal box}}
   */
  openSwal(event) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This report will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3366ff',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteReport(event);
      }
      else {
        event.confirm.reject();
      }
    })
  }

  /**
   * @function{{clear}}
   * @description{{clear the filter by id}}
   */
  clear() {
    this.router.navigate(['pages/report']);
  }
  
  onRowSelect(event): void {
    // console.log(event.data);
    this.rowData = event.data;
  }

  getClick(event) {
    if(event.target.outerHTML == '<button class="pushBtn" nbbutton="">Send Push</button>') {
      console.log('push btn',this.rowData);
      this.openModal(this.dialog);
    }
  }

  /**
   * @function{{openModal}}
   * @description{{open dialog box}}
   */
  openModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
    if(this.rowData.involved_parties.orgUserid) {
      this.getUser(this.rowData.involved_parties.orgUserid);
    }
    if(this.rowData.involved_parties.orgID) {
      this.getOrganization(this.rowData.involved_parties.orgID);
    }
  }

  /**
   * @function{{getUser}}
   * @description{{get user by id method}}
   */
  getUser(id) {
    this.databaseServ.getUserById(id)
    .subscribe(
      (user: any) => {
        // console.log(user);
        this.userData = user;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{getOrganization}}
   * @description{{get organization by id method}}
   */
  getOrganization(id) {
    this.databaseServ.getOrgById(id)
    .subscribe(
      (org: any) => {
        // console.log(org);
        this.orgData = org;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{sendPush}}
   * @description{{send push method}}
   */
  sendPush() {
    let tokenArr = [];
    if(this.userData) {
      if(this.userData.devicetoken) {
        tokenArr.push(this.userData.devicetoken);
      }
    }
    if(this.orgData) {
      if(this.orgData.devicetoken) {
        tokenArr.push(this.orgData.devicetoken);
      }
    }
    // console.log('tokenArr',tokenArr);
    // console.log('titleModel',this.titleModel);
    // console.log('bodyModel',this.bodyModel);
    if(tokenArr.length>0) {
      this.databaseServ.sendPushNotification(this.titleModel, this.bodyModel, tokenArr)
      .subscribe(
        (res: any) => {
          this.toastrService.success('Notification sent successfully.', 'Success!');
          this.storeNotification();
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.toastrService.danger('Something went wrong.', 'Error!');
        }
      );
    }
    else {
      this.storeNotification();
    }
  }

  /**
   * @function{{storeNotification}}
   * @description{{store notification method}}
   */
  storeNotification() {
    let notiObj = {
      id: '',
      reportId: this.rowData.id,
      orgID: this.rowData.involved_parties.orgID,
      orgUserid: this.rowData.involved_parties.orgUserid,
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
  }

}
