import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthhenticationService } from '../../../services/authhentication.service';
import { DatabaseService } from '../../../services/database.service';
import { DataServiceService } from '../../../services/data-service.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  userRes: any;
  sltdOrg: string = '';
  organizations: any = [];

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ 
    { title: 'Change password' }, 
    { title: 'Log out' } 
  ];
  userMenuCopy: any = this.userMenu;
  notifications: any = [];

  constructor(private sidebarService: NbSidebarService,
              public afAuth: AngularFireAuth,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authServ: AuthhenticationService,
              private dataServ: DataServiceService,
              private router: Router,
              private databaseServ: DatabaseService
              ) {
                this.menuService.onItemClick().subscribe(event => {
                  this.onContecxtItemSelection(event.item.title);
                });
  }

  onContecxtItemSelection(title) {
    // console.log(title);
    // console.log(this.user);
    if(title == 'Log out') {
      this.authServ.logout()
      .then(
        (res) => {
          this.router.navigateByUrl('/auth/login');
        }
      ).catch(
        err => {
          console.log(err);
        }
      );
    }
    if(title == 'Change password') {
      this.router.navigateByUrl('/pages/change-password');
    }
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.currentTheme = 'dark';
    this.afAuth.authState.subscribe(auth => {
      if(auth) {
        this.dataServ.userSource.subscribe(
          (res: any) => {
            console.log('user page',res);
            if(res) {
              this.userRes = res;
              if(res.userType == 'admin') {
                this.getNotifications();
              }
              else {
                this.userMenuCopy = this.userMenu.filter(x => x.title == 'Log out');
                this.getUserOrganizations();
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => {this.userPictureOnly = isLessThanXl;
        this.user.name = 'Admin';
        // this.user.picture = "assets/images/default_user.png";
        this.user.picture = "assets/images/tribe_logo.png";
      });

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => {this.currentTheme = themeName});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  goNotifications() {
    this.router.navigateByUrl('/pages/notifications');
  }

  getNotifications() {
    this.databaseServ.getNotifications().subscribe(
      (noti) => {
        // console.log(noti);
        this.notifications = noti;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getUserOrganizations() {
    this.databaseServ.getUserOrganizationById(this.userRes.userData.uid).subscribe(
      (org: any) => {
        console.log(org);
        this.sltdOrg = org[0].id;
        this.organizations = org;
        this.getNotificationsOfOrgs();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getNotificationsOfOrgs() {
    this.databaseServ.getNotificationsByOrgId(this.sltdOrg).subscribe(
      (res: any) => {
        // console.log('noti',res);
        this.notifications = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
