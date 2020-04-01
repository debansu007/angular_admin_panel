import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { CKEditorModule } from 'ng2-ckeditor';

const routes: Routes = [{
  path: '',
  component: PrivacyComponent,
}];

@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
    CKEditorModule
  ]
})
export class PrivacyModule { }
