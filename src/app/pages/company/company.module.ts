import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';

const routes: Routes = [{
  path: '',
  component: CompanyComponent,
}];

@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule
  ]
})
export class CompanyModule { }
