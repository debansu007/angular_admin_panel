import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  canDisplay: boolean = false;

  constructor(
    private menuService: NbMenuService,
    private afAuth: AngularFireAuth,
    private router: Router
    ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.canDisplay = false;
        this.router.navigate(['auth/login']);
      }
      else {
        this.canDisplay = true;
        console.log('no issues');
      }
    });
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
