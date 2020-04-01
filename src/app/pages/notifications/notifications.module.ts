import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { NbListModule, NbCardModule, NbIconModule, NbTooltipModule, NbSelectModule, NbInputModule, NbButtonModule } from '@nebular/theme';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
  }
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbListModule,
    NbCardModule,
    NbIconModule,
    NbTooltipModule,
    FormsModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule
  ]
})
export class NotificationsModule { }
