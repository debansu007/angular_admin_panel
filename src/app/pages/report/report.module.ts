import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbDialogModule, NbButtonModule, NbSelectModule } from '@nebular/theme';

const routes: Routes = [{
  path: '',
  component: ReportComponent,
}];

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    NbSelectModule
  ]
})
export class ReportModule { }
