import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushNotificationComponent } from './push-notification.component';
import { Routes, RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  component: PushNotificationComponent,
}];

@NgModule({
  declarations: [PushNotificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
  ]
})
export class PushNotificationModule { }
