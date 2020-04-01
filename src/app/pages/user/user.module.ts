import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';

const routes: Routes = [{
  path: '',
  component: UserComponent,
}];

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
  ]
})
export class UserModule { }
