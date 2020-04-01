/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { AuthhenticationService } from './services/authhentication.service';
import { DataServiceService } from './services/data-service.service';
import { DatabaseService } from './services/database.service';
import { environment } from '../environments/environment';
@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService, 
    private authServ: AuthhenticationService,
    private dataServ: DataServiceService,
    private databaseServ: DatabaseService
    ) {
    this.authServ.authUser.subscribe(
      (res: any) => {
        console.log('look',res);
        if(res) {
          if(res.email == environment.adminEmail) {
            this.dataServ.changeData({ userType: 'admin', userData: res });
          }
          else {
            this.checkUser(res);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.authServ.authenticationState.subscribe(
      (res: any) => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
    this.dataServ.userSource.subscribe(
      (res: any) => {
        console.log('foo',res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkUser(data) {
    console.log('data',data);
    this.databaseServ.getUserOrganizationById(data.uid)
    .subscribe(
      (org: any) => {
        console.log('check',org);
        if(org.length>0) {
          this.dataServ.changeData({ userType: 'organization', userData: data });
          // this.authServ.authState = data;
          // console.log(this.authServ.authState);
          // this.router.navigate(['pages/dashboard']);
        }
        else {
          // this.toastrService.danger('User do not have any organizations.', 'Error!');
          this.authServ.logout();
          // this.router.navigate(['auth/login']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
