import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="filMenu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
  filMenu: any = [];

  constructor(
    public dataServ: DataServiceService
  ) {
    this.dataServ.userSource.subscribe(
      (res: any) => {
        console.log('menu thing',res);
        if(res) {
          if(res.userType == 'admin') {
            console.log('all menu',this.menu);
            this.filMenu = this.menu;
          }
          if(res.userType == 'organization') {
            this.filMenu = this.menu.filter(x => (x.title.toLowerCase()!='users' && x.title.toLowerCase()!='terms of service' && x.title.toLowerCase()!='privacy policy' && x.title.toLowerCase()!='company' && x.title.toLowerCase()!='push notification'));
            console.log('filtered menu',this.filMenu);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
