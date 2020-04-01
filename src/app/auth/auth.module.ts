import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbSelectModule,
  NbRadioModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { LoginComponent } from './login/login.component';
import { NgxRegisterComponent } from './register/register.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbSelectModule,
    NbRadioModule,
    NgxAuthRoutingModule,
    NbSpinnerModule,
    NbAuthModule,
  ],
  declarations: [
    LoginComponent,
    NgxRegisterComponent,
  ],
})
export class NgxAuthModule {
}