import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { NbInputModule, NbCardModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  component: ChangePasswordComponent,
}];

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbSpinnerModule,
  ]
})
export class ChangePasswordModule { }
